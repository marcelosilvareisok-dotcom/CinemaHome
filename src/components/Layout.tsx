import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Share2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const handleShare = async () => {
    const shareData = {
      title: 'CINEMAHOME',
      text: '🎬 Venha assistir aos melhores filmes e séries no CINEMAHOME! 🍿\n\nSe curtir, considere nos dar um apoio opcional para mantermos o projeto no ar! ❤️',
      url: 'https://cinema-home.vercel.app/',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between p-4 bg-black/80 sticky top-0 z-50 backdrop-blur-sm border-b border-zinc-900">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-red-600 font-bold text-3xl tracking-tighter">CINEMAHOME</Link>
          <div className="hidden md:flex gap-4 text-sm font-medium text-zinc-300">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <Link to="/" className="hover:text-white transition-colors">Séries</Link>
            <Link to="/" className="hover:text-white transition-colors">Filmes</Link>
            <Link to="/" className="hover:text-white transition-colors">Bombando</Link>
            <Link to="/" className="hover:text-white transition-colors">Minha Lista</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold animate-pulse hover:animate-none hover:scale-105 transition-all shadow-[0_0_15px_rgba(220,38,38,0.6)] mr-2"
            title="Compartilhar App"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartilhar App</span>
          </button>
          <Link to="/admin" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <Link to="/login" className="hover:text-gray-300 text-sm font-medium">Entrar</Link>
          <Link to="/plan" className="bg-red-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition-colors">Assinar</Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
