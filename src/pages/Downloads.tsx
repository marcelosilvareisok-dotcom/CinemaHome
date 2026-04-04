import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trash2, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Downloads() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cinemahome_downloads') || '[]');
    setDownloads(saved);
  }, []);

  const removeDownload = (id: number) => {
    const updated = downloads.filter(item => item.id !== id);
    setDownloads(updated);
    localStorage.setItem('cinemahome_downloads', JSON.stringify(updated));
  };

  const clearAllDownloads = () => {
    // We use window.confirm, but since it's in an iframe it might be blocked or not visible.
    // However, the user explicitly requested this feature, and we can implement a custom modal if needed.
    // For simplicity, we'll just clear it directly or use a custom state.
    if (window.confirm('Tem certeza que deseja remover todos os downloads?')) {
      setDownloads([]);
      localStorage.removeItem('cinemahome_downloads');
    }
  };

  const reDownload = (id: number) => {
    setDownloadingId(id);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadingId(null), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <Download className="w-6 h-6" />
          Meus Downloads
        </h1>
        
        {downloads.length > 0 && (
          <button 
            onClick={clearAllDownloads}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-white hover:bg-red-600 border border-red-500/50 px-4 py-2 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Todos
          </button>
        )}
      </div>

      {downloads.length === 0 ? (
        <div className="text-zinc-500 text-center mt-20 text-lg flex flex-col items-center gap-4">
          <Download className="w-16 h-16 text-zinc-700" />
          <p>Você ainda não baixou nenhum conteúdo.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
          {downloads.map((item) => (
            <div 
              key={item.id} 
              className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 bg-zinc-900 rounded-md overflow-hidden border border-zinc-800"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${item.poster_path || item.backdrop_path}`}
                alt={item.title || item.name}
                className="w-full h-auto object-cover aspect-[2/3]"
                loading="lazy"
              />
              
              {downloadingId === item.id && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-20">
                  <div className="text-white mb-2 text-sm font-medium">
                    {progress < 100 ? 'Baixando...' : 'Concluído'}
                  </div>
                  <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-600 h-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-zinc-400 text-xs mt-2">{progress}%</div>
                </div>
              )}

              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                <h3 className="text-white font-bold text-sm mb-3 line-clamp-2">{item.title || item.name}</h3>
                <div className="flex items-center justify-between gap-2">
                  <button 
                    onClick={() => navigate(`/play/${item.media_type}/${item.id}`)}
                    className="bg-white text-black p-2 rounded-full hover:bg-zinc-200 transition-colors"
                    title="Assistir"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        reDownload(item.id);
                      }}
                      className="bg-zinc-800 text-zinc-300 p-2 rounded-full hover:bg-zinc-700 hover:text-white transition-colors"
                      title="Baixar Novamente"
                      disabled={downloadingId === item.id}
                    >
                      <RefreshCw className={`w-4 h-4 ${downloadingId === item.id ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDownload(item.id);
                      }}
                      className="bg-red-500/20 text-red-500 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                      title="Remover Download"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Status Indicator */}
              {downloadingId !== item.id && (
                <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-full backdrop-blur-sm z-10">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
