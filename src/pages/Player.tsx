import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Server } from 'lucide-react';

export default function Player() {
  const { type, id } = useParams<{ type: string, id: string }>();
  const navigate = useNavigate();
  const [activeServer, setActiveServer] = useState<number>(0);

  // Múltiplos servidores focados em conteúdo Dublado/Legendado em PT-BR
  const servers = [
    { name: 'Servidor 1 (Dublado/Legendado)', url: `https://superflixapi.top/${type === 'movie' ? 'filme' : 'serie'}/${id}` },
    { name: 'Servidor 2 (Alternativo PT-BR)', url: `https://embed.warezcdn.net/${type === 'movie' ? 'filme' : 'serie'}/${id}` },
    { name: 'Servidor 3 (Global com Legendas)', url: `https://vidsrc.net/embed/${type}?tmdb=${id}` }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-red-500 transition-colors bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm overflow-x-auto">
          <Server className="w-4 h-4 text-zinc-400 hidden sm:block" />
          <span className="text-sm text-zinc-400 mr-2 hidden sm:block">Servidor:</span>
          {servers.map((server, index) => (
            <button
              key={index}
              onClick={() => setActiveServer(index)}
              className={`text-xs sm:text-sm px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
                activeServer === index 
                  ? 'bg-red-600 text-white font-bold' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full flex-1 h-screen">
        <iframe
          className="w-full h-full min-h-screen"
          src={servers[activeServer].url}
          title="Movie Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
