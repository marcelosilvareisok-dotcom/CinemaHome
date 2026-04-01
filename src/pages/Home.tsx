import { useEffect, useState } from 'react';
import { Play, Info } from 'lucide-react';
import { getNetflixOriginals, getTrending, getTopRated, getActionMovies, getComedyMovies, getHorrorMovies } from '../services/tmdb';
import Row from '../components/Row';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview: string;
}

export default function Home() {
  const [featured, setFeatured] = useState<Movie | null>(null);

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
          
          <div className="flex gap-4 mb-6">
            <button className="flex items-center gap-2 bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded md:text-lg font-bold hover:bg-zinc-200 transition-colors">
              <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
              Assistir
            </button>
            <button className="flex items-center gap-2 bg-zinc-500/70 text-white px-6 py-2 md:px-8 md:py-3 rounded md:text-lg font-bold hover:bg-zinc-500/90 transition-colors backdrop-blur-sm">
              <Info className="w-5 h-5 md:w-6 md:h-6" />
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
        <Row title="Originais CINEMAHOME" fetchData={getNetflixOriginals} isLargeRow />
        <Row title="Em Alta" fetchData={getTrending} />
        <Row title="Aclamados pela Crítica" fetchData={getTopRated} />
        <Row title="Ação e Aventura" fetchData={getActionMovies} />
        <Row title="Comédias" fetchData={getComedyMovies} />
        <Row title="Terror" fetchData={getHorrorMovies} />
      </div>
    </div>
  );
}
