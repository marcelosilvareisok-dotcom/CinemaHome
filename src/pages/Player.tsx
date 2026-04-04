import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle, Volume2, Settings2, Loader2, MonitorPlay, Smartphone } from 'lucide-react';
import { getMovieDetails } from '../services/tmdb';

export default function Player() {
  const { type, id } = useParams<{ type: string, id: string }>();
  const navigate = useNavigate();
  const [activeServer, setActiveServer] = useState(0);
  const [showControlsToast, setShowControlsToast] = useState(false);
  const [isCinemaModeConfirmed, setIsCinemaModeConfirmed] = useState(false);

  // API do EmbedMovies.org (myembed.biz) - Não requer chave de API!
  const servers = [
    {
      name: 'Servidor Principal (EmbedMovies)',
      url: `https://myembed.biz/${type === 'movie' ? 'filme' : 'serie'}/${id}`
    }
  ];

  useEffect(() => {
    saveToHistory();
    
    const startTime = Date.now();

    // Cleanup fullscreen and orientation on unmount
    return () => {
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        const orientation = (window.screen.orientation as any);
        if (orientation && orientation.unlock) {
          orientation.unlock();
        }
      } catch (error) {
        console.warn("Cleanup failed", error);
      }
      
      // Simulate progress saving on unmount
      const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
      updateProgressInHistory(timeSpentSeconds);
    };
  }, []);

  const updateProgressInHistory = (secondsWatched: number) => {
    try {
      const currentHistory = JSON.parse(localStorage.getItem('cinemahome_history') || '[]');
      const itemIndex = currentHistory.findIndex((item: any) => item.id === Number(id));
      
      if (itemIndex !== -1) {
        // Simulate a total duration of 120 minutes (7200 seconds) for movies, 45 mins (2700s) for tv
        const totalSeconds = type === 'movie' ? 7200 : 2700;
        // Add previously watched time if exists
        const previousProgress = currentHistory[itemIndex].progressSeconds || 0;
        const newProgress = Math.min(previousProgress + secondsWatched, totalSeconds);
        const progressPercentage = Math.round((newProgress / totalSeconds) * 100);
        
        currentHistory[itemIndex] = {
          ...currentHistory[itemIndex],
          progressSeconds: newProgress,
          progressPercentage: progressPercentage
        };
        
        localStorage.setItem('cinemahome_history', JSON.stringify(currentHistory));
      }
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

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

  const handleFakeControlClick = () => {
    setShowControlsToast(true);
    setTimeout(() => setShowControlsToast(false), 4000);
  };

  const handleConfirmCinemaMode = async () => {
    try {
      const docElm = document.documentElement;
      if (docElm.requestFullscreen) {
        await docElm.requestFullscreen();
      }
      
      // Attempt to lock orientation to landscape
      const orientation = (window.screen.orientation as any);
      if (orientation && orientation.lock) {
        await orientation.lock('landscape');
      }
    } catch (error) {
      console.warn("Fullscreen or orientation lock failed. Proceeding anyway.", error);
    }
    setIsCinemaModeConfirmed(true);
  };

  if (!isCinemaModeConfirmed) {
    return (
      <div className="fixed inset-0 bg-zinc-950 text-white z-50 flex flex-col items-center justify-center p-6">
        <div className="absolute top-0 left-0 w-full p-4 z-50">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/50 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="font-medium">Voltar</span>
          </button>
        </div>

        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full"></div>
            <div className="relative bg-zinc-800 p-4 rounded-full border border-zinc-700">
              <MonitorPlay className="w-12 h-12 text-red-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 text-white">Modo Cinema</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Você será redirecionado para o modo cinema (widescreen) para uma melhor experiência. Recomendamos virar o seu celular.
          </p>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleConfirmCinemaMode}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Confirmar e Assistir
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3.5 px-6 rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        </div>
      </div>

      {/* Loading / Player */}
      <div className="w-full h-full flex-1 flex items-center justify-center bg-black">
        <iframe
          className="w-full h-full animate-in fade-in duration-1000"
          src={servers[activeServer].url}
          title="Movie Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        ></iframe>
      </div>
    </div>
  );
}
