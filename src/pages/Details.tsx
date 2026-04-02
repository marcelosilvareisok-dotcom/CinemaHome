import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ArrowLeft, Star, Calendar } from 'lucide-react';
import { getMovieDetails } from '../services/tmdb';
import AdBanner from '../components/AdBanner';

export default function Details() {
  const { type, id } = useParams<{ type: string, id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inList, setInList] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      if (!id || !type) return;
      try {
        const response = await getMovieDetails(id, type as 'movie' | 'tv');
        setMovie(response.data);
        
        // Check if in list
        const savedList = localStorage.getItem('cinemahome_mylist');
        if (savedList) {
          const list = JSON.parse(savedList);
          setInList(list.some((item: any) => item.id === response.data.id));
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id, type]);

  const toggleList = () => {
    if (!movie) return;
    
    const savedList = localStorage.getItem('cinemahome_mylist');
    let list = savedList ? JSON.parse(savedList) : [];
    
    if (inList) {
      list = list.filter((item: any) => item.id !== movie.id);
    } else {
      // Add media_type to the movie object so MyList knows where to route
      const movieToAdd = { ...movie, media_type: type };
      list.push(movieToAdd);
    }
    
    localStorage.setItem('cinemahome_mylist', JSON.stringify(list));
    setInList(!inList);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Conteúdo não encontrado</h2>
        <button onClick={() => navigate(-1)} className="bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative">
      {/* Backdrop */}
      <div 
        className="h-[60vh] md:h-[80vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white hover:text-red-500 transition-colors bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 -mt-32 md:-mt-64 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="hidden md:block w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl border border-zinc-800">
            <img 
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
              alt={movie.title || movie.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {movie.title || movie.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-zinc-300 mb-6">
              {movie.vote_average && (
                <div className="flex items-center gap-1 text-green-400 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{(movie.vote_average * 10).toFixed(0)}% Relevante</span>
                </div>
              )}
              {movie.release_date || movie.first_air_date ? (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{(movie.release_date || movie.first_air_date).substring(0, 4)}</span>
                </div>
              ) : null}
              {movie.runtime && (
                <span>{movie.runtime} min</span>
              )}
              {movie.number_of_seasons && (
                <span>{movie.number_of_seasons} Temporada{movie.number_of_seasons > 1 ? 's' : ''}</span>
              )}
              <div className="flex gap-2 text-xs font-semibold">
                <span className="border border-zinc-600 px-2 py-0.5 rounded">HD</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                onClick={() => navigate(`/play/${type}/${movie.id}`)}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded md:text-lg font-bold hover:bg-zinc-200 transition-colors"
              >
                <Play className="w-6 h-6 fill-current" />
                Assistir
              </button>
              <button 
                onClick={toggleList}
                className="flex items-center gap-2 border border-zinc-500 text-white px-6 py-3 rounded md:text-lg font-bold hover:bg-zinc-800 transition-colors"
              >
                {inList ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                {inList ? 'Na Minha Lista' : 'Minha Lista'}
              </button>
            </div>

            <p className="text-lg md:text-xl text-zinc-200 leading-relaxed mb-8 max-w-3xl">
              {movie.overview || "Nenhuma sinopse disponível para este título."}
            </p>

            <div className="space-y-4 text-sm md:text-base text-zinc-400">
              {movie.genres && movie.genres.length > 0 && (
                <p>
                  <span className="text-zinc-500">Gêneros:</span>{' '}
                  <span className="text-white">{movie.genres.map((g: any) => g.name).join(', ')}</span>
                </p>
              )}
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <p>
                  <span className="text-zinc-500">Elenco:</span>{' '}
                  <span className="text-white">
                    {movie.credits.cast.slice(0, 5).map((c: any) => c.name).join(', ')}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <AdBanner />
        </div>
      </div>
    </div>
  );
}
