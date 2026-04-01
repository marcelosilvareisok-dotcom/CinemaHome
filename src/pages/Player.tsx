import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // O TMDB é um banco de dados (como o IMDB) e não hospeda os arquivos de vídeo dos filmes.
  // Para reproduzir o filme completo usando o ID do TMDB, utilizamos um serviço de embed de terceiros (vidsrc).
  const videoSrc = `https://vidsrc.net/embed/movie?tmdb=${id}`;

  return (
    <div className="min-h-screen bg-black text-white relative">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white hover:text-red-500 transition-colors bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="font-medium">Voltar</span>
      </button>

      <div className="w-full h-screen">
        <iframe
          className="w-full h-full"
          src={videoSrc}
          title="Movie Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
