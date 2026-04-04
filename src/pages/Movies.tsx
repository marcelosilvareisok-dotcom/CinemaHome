import { useEffect, useState } from 'react';
import { Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPopularMovies, getActionMovies, getComedyMovies, getHorrorMovies, getRomanceMovies, getDocumentaries, getMoviesByGenre } from '../services/tmdb';
import Row from '../components/Row';
import AdBanner from '../components/AdBanner';

const MOVIE_GENRES = [
  { id: '', name: 'Todos' },
  { id: '28', name: 'Ação' },
  { id: '35', name: 'Comédia' },
  { id: '27', name: 'Terror' },
  { id: '10749', name: 'Romance' },
  { id: '99', name: 'Documentários' },
  { id: '878', name: 'Ficção Científica' },
  { id: '18', name: 'Drama' },
];

export default function Movies() {
  const [featured, setFeatured] = useState<any>(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await getPopularMovies();
        const results = request.data.results;
        setFeatured(results[Math.floor(Math.random() * results.length)]);
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
        className="h-[70vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${featured?.backdrop_path}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 pb-24">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg max-w-2xl">
            {featured?.title || featured?.name}
          </h1>
          
          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {MOVIE_GENRES.map(genre => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedGenre === genre.id 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black/50 text-white border-zinc-600 hover:border-white backdrop-blur-sm'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => featured && navigate(`/play/movie/${featured.id}`)} 
              className="flex items-center gap-2 bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded md:text-lg font-bold hover:bg-zinc-200 transition-colors"
            >
              <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" /> Assistir
            </button>
            <button 
              onClick={() => featured && navigate(`/details/movie/${featured.id}`)} 
              className="flex items-center gap-2 bg-zinc-500/70 text-white px-6 py-2 md:px-8 md:py-3 rounded md:text-lg font-bold hover:bg-zinc-500/90 transition-colors backdrop-blur-sm"
            >
              <Info className="w-5 h-5 md:w-6 md:h-6" /> Mais Informações
            </button>
          </div>
          <p className="text-sm md:text-lg max-w-2xl drop-shadow-md leading-relaxed text-zinc-200">
            {truncate(featured?.overview || "", 150)}
          </p>
        </div>
      </header>

      <div className="-mt-24 relative z-10 pb-16 space-y-8">
        {selectedGenre ? (
          <Row title={`Resultados: ${MOVIE_GENRES.find(g => g.id === selectedGenre)?.name}`} fetchData={() => getMoviesByGenre(selectedGenre)} isLargeRow />
        ) : (
          <>
            <Row title="Filmes Populares" fetchData={getPopularMovies} isLargeRow />
            
            <div className="px-4 md:px-12 py-4">
              <AdBanner />
            </div>

            <Row title="Ação e Aventura" fetchData={getActionMovies} />
            <Row title="Comédias" fetchData={getComedyMovies} />
            
            <div className="px-4 md:px-12 py-4">
              <AdBanner />
            </div>

            <Row title="Terror" fetchData={getHorrorMovies} />
            <Row title="Romance" fetchData={getRomanceMovies} />
            <Row title="Documentários" fetchData={getDocumentaries} />
          </>
        )}
      </div>
    </div>
  );
}
