import { useEffect, useState } from 'react';
import { Play, Info, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNetflixOriginals, getTrending, getTopRated, getActionMovies, getComedyMovies, getHorrorMovies } from '../services/tmdb';
import Row from '../components/Row';
import AdBanner from '../components/AdBanner';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview: string;
}

export default function Home() {
  const [featured, setFeatured] = useState<Movie | null>(null);
  const navigate = useNavigate();
  const hasTmdbKey = import.meta.env.VITE_TMDB_API_KEY && import.meta.env.VITE_TMDB_API_KEY !== 'undefined';

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await getNetflixOriginals();
        const results = request.data.results;
        setFeatured(
          results[Math.floor(Math.random() * results.length - 1)]
        );
      } catch (error) {
        console.error("Erro ao carregar destaque:", error);
      }
    }
    fetchData();
  }, []);

  function truncate(str: string, n: number) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      {!hasTmdbKey && (
        <div className="fixed top-16 left-0 w-full z-50 bg-yellow-600 text-white p-3 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-lg">
          <KeyRound className="w-4 h-4" />
          <span>
            <strong>API do TMDB não configurada!</strong> O catálogo está mostrando dados de teste. 
            Adicione a variável <code className="bg-black/20 px-1 rounded">VITE_TMDB_API_KEY</code> nas configurações (Settings) do AI Studio.
          </span>
        </div>
      )}

      {/* Hero Banner */}
      <header 
        className="h-[80vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${featured?.backdrop_path}")`,
          backgroundPosition: "center center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 pb-32">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg max-w-2xl">
            {featured?.title || featured?.name}
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={() => {
                const mediaType = featured?.media_type || (featured?.name && !featured?.title ? 'tv' : 'movie');
                featured && navigate(`/play/${mediaType}/${featured.id}`);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white px-8 py-3 md:px-10 md:py-4 rounded-lg text-lg md:text-xl font-black hover:scale-105 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.5)]"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" />
              Assistir Agora
            </button>
            <button 
              onClick={() => {
                const mediaType = featured?.media_type || (featured?.name && !featured?.title ? 'tv' : 'movie');
                featured && navigate(`/details/${mediaType}/${featured.id}`);
              }}
              className="flex items-center justify-center gap-2 bg-zinc-800/80 text-white px-8 py-3 md:px-10 md:py-4 rounded-lg text-lg md:text-xl font-bold hover:bg-zinc-700 transition-colors backdrop-blur-md border border-zinc-600"
            >
              <Info className="w-6 h-6 md:w-8 md:h-8" />
              Mais Informações
            </button>
          </div>
          
          <p className="text-sm md:text-lg max-w-2xl drop-shadow-md leading-relaxed text-zinc-200">
            {truncate(featured?.overview || "", 150)}
          </p>
        </div>
      </header>

      {/* Rows */}
      <div className="-mt-24 relative z-10 pb-16 space-y-8">
        <Row title="Originais Cinema em Casa" fetchData={getNetflixOriginals} isLargeRow />
        <Row title="Em Alta" fetchData={getTrending} />
        
        <div className="px-4 md:px-12 py-4">
          <AdBanner />
        </div>

        <Row title="Aclamados pela Crítica" fetchData={getTopRated} />
        <Row title="Ação e Aventura" fetchData={getActionMovies} />
        
        <div className="px-4 md:px-12 py-4">
          <AdBanner />
        </div>

        <Row title="Comédias" fetchData={getComedyMovies} />
        <Row title="Terror" fetchData={getHorrorMovies} />
      </div>
    </div>
  );
}
