import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Check, Loader2, Clapperboard } from 'lucide-react';

export default function Player() {
  const { type, id } = useParams<{ type: string, id: string }>();
  const navigate = useNavigate();
  const [activeServer, setActiveServer] = useState<number>(0);
  const [showServers, setShowServers] = useState(false);
  const [status, setStatus] = useState<'searching' | 'playing'>('searching');
  const [countdown, setCountdown] = useState(3);

  // Múltiplos servidores focados em conteúdo Dublado/Legendado em PT-BR
  const servers = [
    { 
      name: 'Opção 1 (Recomendado)', 
      url: `https://superflixapi.top/${type === 'movie' ? 'filme' : 'serie'}/${id}`,
      lang: 'Dublado PT-BR (Prioridade)'
    },
    { 
      name: 'Opção 2 (Alternativo)', 
      url: `https://embed.warezcdn.net/${type === 'movie' ? 'filme' : 'serie'}/${id}`,
      lang: 'Dublado ou Legendado'
    },
    { 
      name: 'Opção 3 (Global)', 
      url: `https://vidsrc.net/embed/${type}?tmdb=${id}`,
      lang: 'Original com Legendas'
    }
  ];

  useEffect(() => {
    if (status === 'searching') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStatus('playing');
      }
    }
  }, [countdown, status]);

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-red-500 transition-colors bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowServers(!showServers)}
            className="flex items-center justify-center p-3 bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-sm transition-all hover:rotate-90"
            title="Configurações de Servidor"
          >
            <Settings className="w-6 h-6 text-zinc-300" />
          </button>

          {showServers && (
            <div className="absolute right-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 bg-zinc-800/50 text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                Fonte de Vídeo
              </div>
              <div className="flex flex-col">
                {servers.map((server, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveServer(index);
                      setShowServers(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                      activeServer === index 
                        ? 'bg-red-600/10 text-red-500 font-medium' 
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{server.name}</span>
                      <span className="text-[10px] opacity-60">{server.lang}</span>
                    </div>
                    {activeServer === index && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex-1 h-screen flex items-center justify-center">
        {status === 'searching' && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center w-32 h-32">
              {/* Círculo pulsante de fundo */}
              <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping"></div>
              {/* Círculo principal com o número */}
              <div className="absolute inset-0 bg-zinc-900/80 rounded-full border-4 border-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                <span 
                  key={countdown} 
                  className="text-6xl font-black text-white animate-in zoom-in duration-300"
                >
                  {countdown}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-2xl font-bold text-zinc-200">Preparando a sessão... 🍿</h2>
              
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                <Check className="w-4 h-4" />
                <span>Carregando versão em Português (Brasil)</span>
              </div>
            </div>
          </div>
        )}

        {status === 'playing' && (
          <iframe
            className="w-full h-full min-h-screen animate-in fade-in duration-1000"
            src={servers[activeServer].url}
            title="Movie Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
}
