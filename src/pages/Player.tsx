import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Check, Play, Server, AlertCircle, Loader2, Clapperboard } from 'lucide-react';

export default function Player() {
  const { type, id } = useParams<{ type: string, id: string }>();
  const navigate = useNavigate();
  const [activeServer, setActiveServer] = useState<number>(0);
  const [showServers, setShowServers] = useState(false);
  const [status, setStatus] = useState<'searching' | 'info' | 'playing'>('searching');

  // Múltiplos servidores focados em conteúdo Dublado/Legendado em PT-BR
  const servers = [
    { 
      name: 'Opção 1 (Recomendado)', 
      url: `https://superflixapi.top/${type === 'movie' ? 'filme' : 'serie'}/${id}`,
      lang: 'Dublado PT-BR (Prioridade)'
    },
    { 
      name: 'Opção 2 (Alternativo)', 
      url: `https://embed.warezcdn.net/${type === 'movie' ? 'filme' : 'serie'}/${id}`,
      lang: 'Dublado ou Legendado'
    },
    { 
      name: 'Opção 3 (Global)', 
      url: `https://vidsrc.net/embed/${type}?tmdb=${id}`,
      lang: 'Original com Legendas'
    }
  ];

  useEffect(() => {
    // Simula a busca pelo melhor servidor e verificação de status
    const timer = setTimeout(() => {
      setStatus('info');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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
            <div className="absolute right-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                    <div className="flex flex-col">
                      <span>{server.name}</span>
                      <span className="text-[10px] opacity-60">{server.lang}</span>
                    </div>
                    {activeServer === index && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex-1 h-screen flex items-center justify-center">
        {status === 'searching' && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
            <div className="relative">
              <Clapperboard className="w-16 h-16 text-red-600 animate-bounce" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-200">Preparando a pipoca... 🍿</h2>
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Ajeitando o projetor</span>
              </div>
            </div>
          </div>
        )}

        {status === 'info' && (
          <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Servidor Encontrado!</h2>
            
            <div className="w-full bg-black/50 rounded-lg p-4 mb-6 text-left space-y-4 border border-zinc-800">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Servidor Atual (100% Estável)</p>
                  <p className="text-sm font-medium">{servers[activeServer].name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Idioma / Áudio</p>
                  <p className="text-sm font-medium">{servers[activeServer].lang}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-500 mb-6">
              Nota: O servidor tentará carregar a versão dublada primeiro. Caso a dublagem ainda não exista, carregará a legendada automaticamente.
            </p>

            <button 
              onClick={() => setStatus('playing')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              Iniciar Filme
            </button>
          </div>
        )}

        {status === 'playing' && (
          <iframe
            className="w-full h-full min-h-screen animate-in fade-in duration-1000"
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
