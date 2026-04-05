import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Settings2, MonitorPlay, Play, Pause, RotateCcw, RotateCw, Tv, ExternalLink, Server, Link as LinkIcon, Info, X } from 'lucide-react';
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
  const [customUrl, setCustomUrl] = useState('');
  const [isCustomPlaying, setIsCustomPlaying] = useState(false);
  const [showAdWarning, setShowAdWarning] = useState(true);
  const { isPremium } = usePremium();

  // Múltiplos servidores para dar opções caso um falhe ou tenha muitos anúncios
  const servers = [
    {
      id: 'warezcdn',
      name: 'Servidor 1 (WarezCDN - Dublado PT-BR)',
      url: `https://embed.warezcdn.com/${type === 'movie' ? 'filme' : 'serie'}/${id}`
    },
    {
      id: 'superflix',
      name: 'Servidor 2 (SuperFlix - Dublado PT-BR)',
      url: `https://myembed.biz/${type === 'movie' ? 'filme' : 'serie'}/${id}`
    },
    {
      id: 'vidsrc',
      name: 'Servidor 3 (VidSrc - Legendado)',
      url: `https://vidsrc.to/embed/${type}/${id}`
    },
    {
      id: 'custom',
      name: 'Servidor 4 (Nativo Sem Anúncios - Requer Link)',
      url: 'custom'
    }
  ];

  useEffect(() => {
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
  }, [id, type]);

  useEffect(() => {
    if (isPlaying && servers[activeServer].id !== 'custom') {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 100));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, activeServer]);

  const updateProgressInHistory = (secondsWatched: number) => {
    try {
      const currentHistory = JSON.parse(localStorage.getItem('cinemahome_history') || '[]');
      const itemIndex = currentHistory.findIndex((item: any) => item.id === Number(id));
      
      if (itemIndex !== -1) {
        const totalSeconds = type === 'movie' ? 7200 : 2700;
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
      const newHistory = filteredHistory.slice(0, 5);
      
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

  const handleCustomPlay = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl) {
      setIsCustomPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 z-50 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 pointer-events-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-red-500 transition-colors bg-black/50 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="font-medium hidden sm:inline">Voltar</span>
          </button>
          
          <div className="flex items-center bg-black/50 rounded-full backdrop-blur-sm px-3 py-1.5 border border-zinc-800">
            <Server className="w-4 h-4 text-zinc-400 mr-2" />
            <select 
              className="bg-transparent text-white text-sm focus:outline-none cursor-pointer max-w-[200px] sm:max-w-none truncate"
              value={activeServer}
              onChange={(e) => {
                setActiveServer(Number(e.target.value));
                setIsCustomPlaying(false);
                setShowAdWarning(true);
              }}
            >
              {servers.map((server, index) => (
                <option key={server.id} value={index} className="bg-zinc-900 text-white">
                  {server.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => window.open(window.location.href, '_blank')}
            className="flex items-center gap-2 bg-red-600/90 hover:bg-red-600 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm transition-all border border-red-500/50 text-xs sm:text-sm font-bold shadow-lg shadow-red-900/20"
            title="Abrir em nova guia"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Guia</span>
          </button>
        </div>

        <div className="relative pointer-events-auto flex flex-col items-end gap-2 hidden md:flex">
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

      {/* Ad Warning Banner */}
      {servers[activeServer].id !== 'custom' && showAdWarning && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/95 border border-zinc-700 text-zinc-300 px-4 py-3 rounded-lg text-sm flex items-start sm:items-center gap-3 max-w-2xl w-[90%] shadow-2xl animate-in slide-in-from-top-4 pointer-events-auto">
          <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <p className="font-medium text-white mb-1">Sobre os anúncios nestes servidores:</p>
            <p className="text-xs sm:text-sm text-zinc-400">
              Servidores gratuitos de filmes sobrevivem exibindo anúncios. Para uma experiência limpa, recomendamos instalar a extensão <strong>uBlock Origin</strong> no seu navegador, ou usar o "Servidor 4" com um link direto.
            </p>
          </div>
          <button onClick={() => setShowAdWarning(false)} className="text-zinc-500 hover:text-white p-1 bg-zinc-800 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading / Player */}
      <div className="w-full h-full flex-1 flex items-center justify-center bg-black relative">
        {servers[activeServer].id === 'custom' ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            {!isCustomPlaying ? (
              <div className="max-w-xl w-full bg-zinc-900/80 p-8 rounded-2xl border border-zinc-800 backdrop-blur-md">
                <div className="flex justify-center mb-6">
                  <div className="bg-red-500/20 p-4 rounded-full">
                    <MonitorPlay className="w-12 h-12 text-red-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Player Nativo (Sem Anúncios)</h2>
                <p className="text-zinc-400 text-center mb-8 text-sm">
                  Para assistir sem nenhum anúncio, você precisa fornecer um link direto de vídeo (.mp4, .mkv). 
                  APIs gratuitas sempre injetam anúncios, esta é a única forma de ter um player 100% limpo.
                </p>
                
                <form onSubmit={handleCustomPlay} className="flex flex-col gap-4">
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input 
                      type="url" 
                      placeholder="Cole o link direto do vídeo (ex: https://.../filme.mp4)"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Reproduzir Vídeo
                  </button>
                </form>
              </div>
            ) : (
              <video 
                src={customUrl} 
                controls 
                autoPlay 
                className="w-full h-full outline-none"
                controlsList="nodownload"
              >
                Seu navegador não suporta a reprodução deste vídeo.
              </video>
            )}
          </div>
        ) : (
          <>
            <iframe
              className="w-full h-full animate-in fade-in duration-1000"
              src={servers[activeServer].url}
              title="Movie Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
            ></iframe>

            {/* Simulated Controls Overlay (Only for iframes to look cool, doesn't actually control iframe) */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-4 pointer-events-none hidden">
              <div className="w-full bg-zinc-700 h-1.5 rounded-full cursor-pointer pointer-events-auto" onClick={() => setProgress(50)}>
                <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex items-center gap-6 pointer-events-auto">
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
          </>
        )}
      </div>
      
      <PremiumNotification 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        feature="Controles Avançados de Reprodução" 
      />
    </div>
  );
}
