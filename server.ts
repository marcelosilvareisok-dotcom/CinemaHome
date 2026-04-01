import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { MercadoPagoConfig, PreApprovalPlan } from "mercadopago";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 🛡️ Cibersegurança em 1º Lugar: Middlewares de Segurança
  // Helmet ajuda a proteger o app configurando vários cabeçalhos HTTP
  app.use(helmet({
    contentSecurityPolicy: false, // Desabilitado temporariamente para o Vite/React funcionar em dev
  }));

  // Rate Limiting: Previne ataques de força bruta e DDoS limitando requisições
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita cada IP a 100 requisições por windowMs
    message: "Muitas requisições deste IP, por favor tente novamente após 15 minutos.",
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);

  app.use(cors());
  app.use(express.json({ limit: '10kb' })); // Limita o tamanho do body para prevenir ataques de payload grande

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 💳 Integração Mercado Pago - Plano de Assinatura
  app.post("/api/subscription/create", async (req, res) => {
    try {
      const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
      
      if (!token) {
        console.warn("[MERCADO PAGO] Token não configurado. Retornando link de simulação.");
        return res.json({ 
          init_point: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=mock",
          mock: true
        });
      }

      const client = new MercadoPagoConfig({ accessToken: token });
      const plan = new PreApprovalPlan(client);
      
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

      const response = await plan.create({
        body: {
          reason: "CINEMAHOME - Plano Mensal",
          auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            billing_day: 10,
            billing_day_proportional: false,
            transaction_amount: 9.99,
            currency_id: "BRL",
            free_trial: {
              frequency: 30,
              frequency_type: "days"
            }
          },
          back_url: `${appUrl}/plan/success`,
        }
      });
      
      res.json({ init_point: response.init_point });
    } catch (error) {
      console.error("[MERCADO PAGO] Erro ao criar plano:", error);
      res.status(500).json({ error: "Falha ao gerar link de pagamento" });
    }
  });

  // Webhook para receber confirmações do Mercado Pago
  app.post("/api/subscription/webhook", (req, res) => {
    console.log("[WEBHOOK MP] Evento recebido:", req.body);
    // Aqui você atualizaria o status do usuário no Supabase para "premium"
    res.status(200).send("OK");
  });

  // 🛠️ Endpoint de Saúde do Sistema (Dashboard Administrativo)
  app.get("/api/admin/system-health", async (req, res) => {
    // Aqui seria ideal adicionar uma verificação de token JWT de Admin
    
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Simulação de verificação de serviços externos
    const dbStatus = "connected"; // Em um cenário real, faria um ping no banco
    const tmdbStatus = process.env.VITE_TMDB_API_KEY ? "configured" : "missing_key";

    res.json({
      status: "online",
      uptime: `${Math.floor(uptime / 60)} minutos`,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      services: {
        database: dbStatus,
        tmdbApi: tmdbStatus,
        server: "healthy"
      },
      issues: tmdbStatus === "missing_key" ? [{
        component: "TMDB API",
        severity: "high",
        message: "Chave da API do TMDB não configurada.",
        fixAction: "Adicione VITE_TMDB_API_KEY no arquivo .env"
      }] : []
    });
  });

  // Ação de reparo simulada
  app.post("/api/admin/repair", (req, res) => {
    const { action } = req.body;
    console.log(`[ADMIN] Executando ação de reparo: ${action}`);
    // Simular tempo de reparo
    setTimeout(() => {
      res.json({ success: true, message: `Ação '${action}' concluída com sucesso.` });
    }, 1500);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();