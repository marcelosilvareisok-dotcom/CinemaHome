import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Check } from 'lucide-react';

export default function Player() {
  const { type, id } = useParams<{ type: string, id: string }>();
  const navigate = useNavigate();
  const [activeServer, setActiveServer] = useState<number>(0);
  const [showServers, setShowServers] = useState(false);

  // Múltiplos servidores focados em conteúdo Dublado/Legendado em PT-BR
  const servers = [
    { name: 'Opção 1 (Recomendado)', url: `https://superflixapi.top/${type === 'movie' ? 'filme' : 'serie'}/${id}` },
    { name: 'Opção 2 (Alternativo)', url: `https://embed.warezcdn.net/${type === 'movie' ? 'filme' : 'serie'}/${id}` },
    { name: 'Opção 3 (Global)', url: `https://vidsrc.net/embed/${type}?tmdb=${id}` }
  ];

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
            <div className="absolute right-0 mt-2 w-56 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                    {server.name}
                    {activeServer === index && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
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
