import { useState } from 'react';
import { Check, ShieldCheck, Film, MonitorPlay, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Plan() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.init_point) {
        if (data.mock) {
          alert('Modo de Simulação: O token do Mercado Pago não está configurado. Redirecionando para página de sucesso simulada.');
          navigate('/plan/success');
        } else {
          // Redireciona para o checkout do Mercado Pago
          window.location.href = data.init_point;
        }
      } else {
        alert('Erro ao gerar link de pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error("Erro ao assinar:", error);
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center py-16 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Escolha seu plano</h1>
          <p className="text-xl text-zinc-400">Sem compromisso, cancele quando quiser.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl max-w-lg mx-auto relative">
          {/* Destaque */}
          <div className="absolute top-0 left-0 w-full bg-red-600 text-center py-2 text-sm font-bold tracking-wider uppercase">
            Mais Popular
          </div>

          <div className="p-8 pt-16">
            <h2 className="text-3xl font-bold mb-2">Plano Premium</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-extrabold text-red-500">R$ 9,99</span>
              <span className="text-zinc-400 text-lg">/mês</span>
            </div>
            
            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 mb-8">
              <p className="text-red-400 font-medium text-center">
                🎉 30 dias totalmente grátis!
              </p>
              <p className="text-zinc-400 text-sm text-center mt-1">
                A cobrança só inicia após o período de teste.
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="text-red-500 w-6 h-6 flex-shrink-0" />
                <span className="text-zinc-300">Catálogo completo de filmes e séries</span>
              </li>
              <li className="flex items-center gap-3">
                <MonitorPlay className="text-red-500 w-6 h-6 flex-shrink-0" />
                <span className="text-zinc-300">Resolução 4K + HDR</span>
              </li>
              <li className="flex items-center gap-3">
                <Smartphone className="text-red-500 w-6 h-6 flex-shrink-0" />
                <span className="text-zinc-300">Assista na TV, computador, celular e tablet</span>
              </li>
              <li className="flex items-center gap-3">
                <Film className="text-red-500 w-6 h-6 flex-shrink-0" />
                <span className="text-zinc-300">Downloads para assistir offline</span>
              </li>
            </ul>

            <button 
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg text-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Assinar Agora</>
              )}
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500 text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Pagamento 100% seguro via Mercado Pago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
