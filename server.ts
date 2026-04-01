import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

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