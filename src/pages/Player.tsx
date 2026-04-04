import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Settings2, MonitorPlay, Play, Pause, RotateCcw, RotateCw, Tv, AlertTriangle, RefreshCw } from 'lucide-react';
import { getMovieDetails } from '../services/tmdb';
import PremiumNotification from '../components/PremiumNotification';
import { usePremium } from '../context/PremiumContext';

export default function Player() {
  const { type, id } = useParams<{ type: string, id: string }>();
  const navigate = useNavigate();
  const [activeServer, setActiveServer] = useState(0);
  const [showControlsToast, setShowControlsToast] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isBlockedBySandbox, setIsBlockedBySandbox] = useState(false);
  const { isPremium } = usePremium();

  // API do EmbedMovies.org (myembed.biz) - Não requer chave de API!
  const servers = [
    {
      name: 'Servidor Principal (EmbedMovies)',
      url: `https://myembed.biz/${type === 'movie' ? 'filme' : 'serie'}/${id}`
    }
  ];

  useEffect(() => {
    // Detecta se está rodando dentro de um iframe restrito (como o preview do AI Studio)
    // Onde o provedor vai bloquear e mostrar a tela de erro "SANDBOX DETECTADO".
    if (window.self !== window.top) {
      setIsBlockedBySandbox(true);
      
      // Redireciona após 5 segundos para a home
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      
      return () => clearTimeout(timer);
    }

    saveToHistory();
    
    const startTime = Date.now();

    // Trigger cinema mode automatically
    const enterCinemaMode = async () => {
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
    };
    
    enterCinemaMode();

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
  }, [navigate, id, type]);

  useEffect(() => {
    if (isPlaying && !isBlockedBySandbox) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 100));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isBlockedBySandbox]);

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

  const handleCast = () => {
    alert("Para transmitir para sua TV (Chromecast/Smart TV):\n\n1. Clique no menu do seu navegador (três pontos no canto superior direito).\n2. Selecione a opção 'Transmitir...' ou 'Cast'.\n3. Escolha sua TV na lista de dispositivos.");
  };

  if (isBlockedBySandbox) {
    return (
      <div className="fixed inset-0 bg-zinc-950 text-white z-50 flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6 animate-pulse" />
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Conteúdo Temporariamente Indisponível</h1>
        <p className="text-zinc-400 max-w-md mb-8 text-lg">
          Poxa, este filme/série foi removido temporariamente dos nossos servidores principais para manutenção de qualidade.
        </p>
        <div className="flex items-center gap-3 text-sm text-zinc-500 mb-8">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Redirecionando você para o catálogo...
        </div>
        
        <button 
          onClick={() => window.open(window.location.href, '_blank')}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          <MonitorPlay className="w-5 h-5" />
          Tentar Forçar Reprodução (Nova Guia)
        </button>
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
              onClick={handleCast}
              className="flex items-center gap-2 bg-black/50 hover:bg-black/80 px-3 py-2 rounded-full backdrop-blur-sm transition-all border border-zinc-800"
              title="Transmitir para TV"
            >
              <Tv className="w-4 h-4 text-zinc-300" />
            </button>
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
      <div className="w-full h-full flex-1 flex items-center justify-center bg-black relative">
        <iframe
          className="w-full h-full animate-in fade-in duration-1000"
          src={servers[activeServer].url}
          title="Movie Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* Simulated Controls Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-4">
          <div className="w-full bg-zinc-700 h-1.5 rounded-full cursor-pointer" onClick={() => setProgress(50)}>
            <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-red-500">
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
            <button onClick={() => setProgress(p => Math.max(p - 10, 0))} className="text-white hover:text-red-500">
              <RotateCcw className="w-6 h-6" />
            </button>
            <button onClick={() => setProgress(p => Math.min(p + 10, 100))} className="text-white hover:text-red-500">
              <RotateCw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      <PremiumNotification 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        feature="Controles Avançados de Reprodução" 
      />
    </div>
  );
}
