import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Trash2, Download } from 'lucide-react';

export default function Downloads() {
  const [downloads, setDownloads] = useState<any[]>([]);
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

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <Download className="w-6 h-6" />
        Minhas Downloads
      </h1>

      {downloads.length === 0 ? (
        <div className="text-zinc-500 text-center mt-20 text-lg">
          Você ainda não baixou nenhum conteúdo.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
          {downloads.map((item) => (
            <div 
              key={item.id} 
              className="relative group cursor-pointer transition-transform duration-300 hover:scale-105"
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
                    onClick={() => navigate(`/play/${item.media_type}/${item.id}`)}
                    className="bg-white text-black p-1.5 rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <button 
                    onClick={() => removeDownload(item.id)}
                    className="border border-red-500 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
