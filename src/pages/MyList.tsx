import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Trash2, Clock } from 'lucide-react';

export default function MyList() {
  const [items, setItems] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load My List
    const savedList = localStorage.getItem('cinemahome_mylist');
    if (savedList) {
      try {
        setItems(JSON.parse(savedList));
      } catch (e) {
        console.error("Erro ao carregar lista:", e);
      }
    }

    // Load History
    const savedHistory = localStorage.getItem('cinemahome_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Erro ao carregar histórico:", e);
      }
    }
  }, []);

  const removeFromList = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const newList = items.filter(item => item.id !== id);
    setItems(newList);
    localStorage.setItem('cinemahome_mylist', JSON.stringify(newList));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cinemahome_history');
  };

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      
      {/* Histórico Section */}
      {history.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              Continuar Assistindo (Histórico)
            </h2>
            <button 
              onClick={clearHistory}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Limpar Histórico
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {history.map((item) => (
              <div 
                key={`history-${item.id}`} 
                className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-50"
                onClick={() => navigate(`/play/${item.type}/${item.id}`)}
              >
                <div className="relative aspect-video rounded-md overflow-hidden bg-zinc-800">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path || item.poster_path}`}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 p-3 rounded-full border-2 border-white/50 group-hover:border-white group-hover:scale-110 transition-all">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                  {/* Fake progress bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-600">
                    <div 
                      className="h-full bg-red-600" 
                      style={{ width: `${Math.max(10, Math.random() * 80)}%` }}
                    ></div>
                  </div>
                </div>
                <h3 className="text-white font-medium text-sm mt-2 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-zinc-400">
                  {new Date(item.timestamp).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Minha Lista Section */}
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Minha Lista</h1>

      {items.length === 0 ? (
        <div className="text-zinc-500 text-center mt-20 text-lg">
          Você ainda não adicionou nenhum título à sua lista.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
          {items.map((item) => {
            const itemType = item.media_type || (item.name && !item.title ? 'tv' : 'movie');
            return (
              <div 
                key={`list-${item.id}`} 
                className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-50"
                onClick={() => navigate(`/play/${itemType}/${item.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500/${item.poster_path || item.backdrop_path}`}
                  alt={item.title || item.name}
                  className="w-full h-auto rounded-md object-cover aspect-[2/3]"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">{item.title || item.name}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/play/${itemType}/${item.id}`); }}
                      className="bg-white text-black p-1.5 rounded-full hover:bg-zinc-200 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                    <button 
                      onClick={(e) => removeFromList(e, item.id)}
                      className="border border-zinc-400 text-white p-1.5 rounded-full hover:border-red-500 hover:text-red-500 transition-colors ml-auto"
                      title="Remover da lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/details/${itemType}/${item.id}`); }}
                      className="border border-zinc-400 text-white p-1.5 rounded-full hover:border-white transition-colors"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
