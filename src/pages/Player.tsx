import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle, Volume2, Settings2, Loader2 } from 'lucide-react';
import { getMovieDetails } from '../services/tmdb';

export default function Player() {
  const { type, id } = useParams<{ type: string, id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'searching' | 'playing'>('searching');
  const [countdown, setCountdown] = useState(3);
  const [activeServer, setActiveServer] = useState(0);
  const [showControlsToast, setShowControlsToast] = useState(false);

  // API do EmbedMovies.org (myembed.biz) - Não requer chave de API!
  const servers = [
    {
      name: 'Servidor Principal (EmbedMovies)',
      url: `https://myembed.biz/${type === 'movie' ? 'filme' : 'serie'}/${id}`
    }
  ];

  useEffect(() => {
    if (status === 'searching') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStatus('playing');
        saveToHistory();
      }
    }
  }, [countdown, status]);

  const saveToHistory = async () => {
    try {
      const response = await getMovieDetails(id!, type as 'movie' | 'tv');
      const details = response.data;
      
      const historyItem = {
        id: details.id,
        type: type,
        title: details.title || details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        timestamp: Date.now()
      };

      const currentHistory = JSON.parse(localStorage.getItem('cinemahome_history') || '[]');
      const filteredHistory = currentHistory.filter((item: any) => item.id !== historyItem.id);
      
      filteredHistory.unshift(historyItem);
      const newHistory = filteredHistory.slice(0, 5); // Keep only last 5
      
      localStorage.setItem('cinemahome_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history", error);
    }
  };

  const handleNextServer = () => {
    const nextServer = (activeServer + 1) % servers.length;
    setActiveServer(nextServer);
    setStatus('searching');
    setCountdown(3); // Reinicia a contagem para o novo servidor
  };

  const handleFakeControlClick = () => {
    setShowControlsToast(true);
    setTimeout(() => setShowControlsToast(false), 4000);
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

        <div className="relative pointer-events-auto flex flex-col items-end gap-2">
          {status === 'playing' && (
            <>
              <div className="flex gap-2">
                <button 
                  onClick={handleFakeControlClick}
                  className="flex items-center gap-2 bg-black/50 hover:bg-black/80 px-3 py-2 rounded-full backdrop-blur-sm transition-all border border-zinc-800"
                  title="Volume"
                >
                  <Volume2 className="w-4 h-4 text-zinc-300" />
                </button>
                <button 
                  onClick={handleFakeControlClick}
                  className="flex items-center gap-2 bg-black/50 hover:bg-black/80 px-3 py-2 rounded-full backdrop-blur-sm transition-all border border-zinc-800"
                  title="Velocidade de Reprodução"
                >
                  <Settings2 className="w-4 h-4 text-zinc-300" />
                  <span className="text-xs font-medium text-zinc-300">1x</span>
                </button>
              </div>

              {showControlsToast && (
                <div className="bg-zinc-900/90 border border-zinc-700 text-sm text-zinc-300 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-top-2">
                  Use os controles nativos dentro do player de vídeo abaixo para ajustar volume, tela cheia e velocidade.
                </div>
              )}
            </>
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
              <h2 className="text-2xl font-bold text-zinc-200">Procurando servidor funcional... 🍿</h2>
              
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Testando: {servers[activeServer].name}</span>
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
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
          ></iframe>
        )}
      </div>
    </div>
  );
}
