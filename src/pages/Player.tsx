import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, AlertCircle } from 'lucide-react';
import { getMovieDetails } from '../services/tmdb';

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      if (!id) return;
      try {
        const response = await getMovieDetails(id);
        const videos = response.data.videos?.results || [];
        
        // Find a trailer or teaser
        const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') ||
                        videos.find((v: any) => v.site === 'YouTube');
        
        if (trailer) {
          setVideoKey(trailer.key);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erro ao buscar vídeo:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white hover:text-red-500 transition-colors bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="font-medium">Voltar</span>
      </button>

      {error || !videoKey ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
          <AlertCircle className="w-16 h-16 text-zinc-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Vídeo Indisponível</h2>
          <p className="text-zinc-400 max-w-md">
            Desculpe, não conseguimos encontrar o vídeo para este título no momento. 
            Isso pode ocorrer se o título não possuir um trailer oficial no YouTube.
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-8 bg-white text-black px-8 py-3 rounded font-bold hover:bg-zinc-200 transition-colors"
          >
            Voltar para o catálogo
          </button>
        </div>
      ) : (
        <div className="w-full h-screen">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}
