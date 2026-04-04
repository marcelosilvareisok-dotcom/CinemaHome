import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  media_type?: 'movie' | 'tv';
}

interface RowProps {
  title: string;
  fetchData: () => Promise<any>;
  isLargeRow?: boolean;
}

export default function Row({ title, fetchData, isLargeRow = false }: RowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const request = await fetchData();
        setMovies(request.data.results);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    }
    fetchMovies();
  }, [fetchData]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="pl-4 md:pl-12 py-4 relative group">
      <h2 className="text-white font-bold md:text-xl mb-4">{title}</h2>
      
      <div className="relative flex items-center">
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-0 z-40 bg-black/50 hover:bg-black/80 text-white h-full w-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center -ml-4 md:-ml-12"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div 
          ref={rowRef}
          className="flex gap-2 overflow-x-scroll scrollbar-hide scroll-smooth py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => {
            const mediaType = movie.media_type || (movie.name && !movie.title ? 'tv' : 'movie');
            return (
            ((isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)) && (
              <div 
                key={movie.id} 
                className={`relative flex-none transition-transform duration-300 hover:scale-105 hover:z-50 cursor-pointer ${
                  isLargeRow ? 'w-[150px] md:w-[200px]' : 'w-[200px] md:w-[280px]'
                }`}
                onClick={() => navigate(`/play/${mediaType}/${movie.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/original/${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                  alt={movie.name || movie.title}
                  className="w-full h-full object-cover rounded-md shadow-lg"
                  loading="lazy"
                />
                
                {/* Hover Info Overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-sm mb-2 line-clamp-1">{movie.title || movie.name}</h3>
                  <div className="flex gap-2 mt-2 w-full">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/play/${mediaType}/${movie.id}`); }}
                      className="flex-1 flex items-center justify-center gap-1 bg-white text-black py-1.5 px-2 rounded hover:bg-zinc-200 transition-colors font-bold text-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Assistir
                    </button>
                    <Link 
                      to={`/details/${mediaType}/${movie.id}`} 
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1 bg-zinc-800/80 text-white py-1.5 px-2 rounded hover:bg-zinc-700 transition-colors font-medium text-xs border border-zinc-600"
                    >
                      <Info className="w-3 h-3" />
                      Info
                    </Link>
                  </div>
                </div>
              </div>
            )
          )})}
        </div>

        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-0 z-40 bg-black/50 hover:bg-black/80 text-white h-full w-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
