import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchContent } from '../services/tmdb';
import { Play, Info, Search as SearchIcon } from 'lucide-react';
import Layout from '../components/Layout';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <Layout>
      <div className="pt-24 px-4 md:px-12 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <SearchIcon className="w-6 h-6" />
          {query ? `Resultados para "${query}"` : 'Pesquisar'}
        </h1>

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

        {!loading && query && results.length === 0 && (
          <div className="text-zinc-500 text-center mt-20 text-lg">
            Nenhum resultado encontrado para "{query}".
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-20">
          {results.map((item) => {
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
    </Layout>
  );
}
