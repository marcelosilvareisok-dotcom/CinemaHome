import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchContent } from '../services/tmdb';
import { Play, Info, Search as SearchIcon, Filter } from 'lucide-react';

const GENRES = [
  { id: 28, name: 'Ação' },
  { id: 35, name: 'Comédia' },
  { id: 27, name: 'Terror' },
  { id: 10749, name: 'Romance' },
  { id: 99, name: 'Documentários' },
  { id: 878, name: 'Ficção Científica' },
  { id: 18, name: 'Drama' },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');

  useEffect(() => {
    async function fetchResults() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await searchContent(query);
        // Filter out people, only keep movies and tv shows with images
        const filteredResults = response.data.results.filter(
          (item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && (item.poster_path || item.backdrop_path)
        );
        setResults(filteredResults);
      } catch (err) {
        console.error("Erro ao buscar:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  const filteredResults = useMemo(() => {
    return results.filter(item => {
      // Genre filter
      if (genreFilter && !item.genre_ids?.includes(Number(genreFilter))) return false;
      
      // Year filter
      const releaseDate = item.release_date || item.first_air_date;
      if (yearFilter && releaseDate && !releaseDate.startsWith(yearFilter)) return false;
      
      // Rating filter
      if (ratingFilter && item.vote_average < Number(ratingFilter)) return false;
      
      return true;
    });
  }, [results, genreFilter, yearFilter, ratingFilter]);

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <SearchIcon className="w-6 h-6" />
        {query ? `Resultados para "${query}"` : 'Pesquisar'}
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-400">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros:</span>
        </div>
        
        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)} className="bg-zinc-800 text-white px-3 py-1.5 rounded text-sm">
          <option value="">Todos os Gêneros</option>
          {GENRES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="bg-zinc-800 text-white px-3 py-1.5 rounded text-sm">
          <option value="">Todos os Anos</option>
          {Array.from({ length: 20 }, (_, i) => 2026 - i).map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        
        <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="bg-zinc-800 text-white px-3 py-1.5 rounded text-sm">
          <option value="">Qualquer Avaliação</option>
          <option value="5">5+</option>
          <option value="7">7+</option>
          <option value="8">8+</option>
        </select>
        
        <button onClick={() => { setGenreFilter(''); setYearFilter(''); setRatingFilter(''); }} className="text-sm text-red-500 hover:text-red-400">Limpar</button>
      </div>

      {!query && (
        <div className="text-zinc-500 text-center mt-20 text-lg">
          Digite algo na barra de pesquisa para encontrar filmes e séries.
        </div>
      )}

      {loading && query && (
        <div className="text-zinc-500 text-center mt-20 text-lg animate-pulse">
          Buscando...
        </div>
      )}

      {!loading && query && filteredResults.length === 0 && (
        <div className="text-zinc-500 text-center mt-20 text-lg">
          Nenhum resultado encontrado para "{query}" com esses filtros.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
        {filteredResults.map((item) => {
          const mediaType = item.media_type || (item.name && !item.title ? 'tv' : 'movie');
          return (
            <div 
              key={item.id} 
              className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-50"
              onClick={() => navigate(`/play/${mediaType}/${item.id}`)}
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
                    onClick={(e) => { e.stopPropagation(); navigate(`/play/${mediaType}/${item.id}`); }}
                    className="bg-white text-black p-1.5 rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/details/${mediaType}/${item.id}`); }}
                    className="border border-zinc-400 text-white p-1.5 rounded-full hover:border-white transition-colors ml-auto"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
