import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Server, AlertTriangle } from 'lucide-react';

export default function Player() {
  const { type, id } = useParams<{ type: string, id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'searching' | 'playing'>('searching');
  const [countdown, setCountdown] = useState(3);
  const [activeServer, setActiveServer] = useState(0);

  // APIs gratuitas variam muito. É essencial ter opções.
  const servers = [
    {
      name: 'Servidor 1 (Dublado PT-BR)',
      url: `https://superflixapi.top/${type === 'movie' ? 'filme' : 'serie'}/${id}`
    },
    {
      name: 'Servidor 2 (Dublado/Legendado)',
      url: `https://embed.warezcdn.net/${type === 'movie' ? 'filme' : 'serie'}/${id}`
    },
    {
      name: 'Servidor 3 (Inglês/Legendado)',
      url: `https://vidsrc.net/embed/${type}?tmdb=${id}`
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

  const handleNextServer = () => {
    const nextServer = (activeServer + 1) % servers.length;
    setActiveServer(nextServer);
    setStatus('searching');
    setCountdown(3); // Reinicia a contagem para o novo servidor
  };

  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="pointer-events-auto flex items-center gap-2 text-white hover:text-red-500 transition-colors bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="relative pointer-events-auto">
          {status === 'playing' && (
            <button 
              onClick={handleNextServer}
              className="flex items-center gap-2 bg-red-600/80 hover:bg-red-600 px-4 py-2 rounded-full backdrop-blur-sm transition-all border border-red-500/50 shadow-lg"
              title="Se o vídeo não carregar ou estiver no idioma errado, clique aqui"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white hidden sm:inline">Filme não rodou? Tentar próximo servidor</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading / Player */}
      <div className="w-full h-full flex-1 flex items-center justify-center">
        {status === 'searching' && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center w-32 h-32">
              <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping"></div>
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
                <span>Buscando automaticamente: {servers[activeServer].name}</span>
              </div>
            </div>
          </div>
        )}

        {status === 'playing' && (
          <iframe
            className="w-full h-full animate-in fade-in duration-1000"
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
