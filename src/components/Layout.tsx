import { useState, ReactNode, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Share2, X, Copy, Heart, MessageCircle, Search } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
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

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText('94991233751');
      alert('Chave PIX (Celular) copiada com sucesso! Muito obrigado pelo apoio! ❤️');
    } catch (err) {
      console.error('Erro ao copiar PIX:', err);
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
          {/* Search Bar */}
          <div className="relative flex items-center">
            <form 
              onSubmit={handleSearch}
              className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 sm:w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Títulos, gente e gêneros"
                className="w-full bg-black/50 border border-white/80 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white transition-colors"
                autoFocus={isSearchOpen}
              />
            </form>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white p-2 hover:text-zinc-300 transition-colors"
              title="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold animate-pulse hover:animate-none hover:scale-105 transition-all shadow-[0_0_15px_rgba(220,38,38,0.6)] mr-1 sm:mr-2"
            title="Compartilhar App"
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Compartilhar</span>
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

      {/* Modal de Compartilhamento / PIX */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              Apoie o CINEMAHOME
            </h2>
            
            <div className="space-y-6">
              {/* Option 1: Share */}
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  Compartilhe com amigos
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Ajude o projeto a crescer compartilhando o app com seus amigos e familiares.
                </p>
                <button 
                  onClick={handleShare}
                  className="w-full bg-white text-black font-bold py-2.5 rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Compartilhar via WhatsApp / Outros
                </button>
              </div>

              {/* Option 2: PIX */}
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Apoio Voluntário (PIX)
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Este projeto é gratuito. Se você curte e quer ajudar a manter os servidores no ar, considere fazer uma doação de qualquer valor. É 100% opcional! ❤️
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black px-3 py-3 rounded text-red-400 font-mono text-center select-all text-lg tracking-wider">
                    94991233751
                  </code>
                  <button 
                    onClick={handleCopyPix}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded transition-colors flex items-center justify-center"
                    title="Copiar PIX"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-2 text-center">Chave Celular do Desenvolvedor</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
