import { useState, ReactNode, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Share2, X, Copy, Heart, MessageCircle, Search, PartyPopper, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showPioneerBanner, setShowPioneerBanner] = useState(() => {
    return sessionStorage.getItem('hidePioneerBanner') !== 'true';
  });
  const [showShareTutorial, setShowShareTutorial] = useState(() => {
    return localStorage.getItem('hasSeenShareTutorial') !== 'true';
  });
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('cinemahome_theme') as 'dark' | 'light') || 'dark';
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('cinemahome_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleCloseBanner = () => {
    setShowPioneerBanner(false);
    sessionStorage.setItem('hidePioneerBanner', 'true');
  };

  const handleCloseTutorial = () => {
    setShowShareTutorial(false);
    localStorage.setItem('hasSeenShareTutorial', 'true');
  };

  const handleShare = async () => {
    const shareText = '🎬 Venha assistir aos melhores filmes e séries no CINEMAHOME! 🍿\nhttps://cinema-home.vercel.app/\n\nSe curtir, considere nos dar um apoio opcional para mantermos o projeto no ar! ❤️';
    
    const shareData = {
      title: 'CINEMAHOME',
      text: shareText,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Mensagem copiada para a área de transferência!');
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
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      {/* Banner Pioneiros */}
      {showPioneerBanner && (
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-black text-center py-2 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md z-[60] relative">
          <PartyPopper className="w-4 h-4 animate-bounce shrink-0" />
          <span className="flex-1">Parabéns! Você é um dos 100 primeiros (os pioneiros!). Acesso VIP liberado sem cadastro! Pegue a pipoca e aproveite! 🍿</span>
          <PartyPopper className="w-4 h-4 animate-bounce shrink-0 hidden sm:block" />
          <button 
            onClick={handleCloseBanner} 
            className="p-1 hover:bg-black/10 rounded-full transition-colors shrink-0"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <nav className="flex items-center justify-between p-4 bg-background/80 sticky top-0 z-50 backdrop-blur-sm border-b border-border transition-colors duration-300">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-red-600 font-bold text-3xl tracking-tighter">CINEMAHOME</Link>
          <div className="hidden md:flex gap-4 text-sm font-medium text-foreground/70">
            <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
            <Link to="/series" className="hover:text-foreground transition-colors">Séries</Link>
            <Link to="/movies" className="hover:text-foreground transition-colors">Filmes</Link>
            <Link to="/trending" className="hover:text-foreground transition-colors">Bombando</Link>
            <Link to="/my-list" className="hover:text-foreground transition-colors">Minha Lista</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-foreground p-2 hover:text-foreground/70 transition-colors"
            title="Alternar Tema"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

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
                className="w-full bg-background/50 border border-border text-foreground text-sm px-3 py-1.5 focus:outline-none focus:border-foreground transition-colors"
                autoFocus={isSearchOpen}
              />
            </form>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-foreground p-2 hover:text-foreground/70 transition-colors"
              title="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <button 
              onClick={() => {
                setIsShareModalOpen(true);
                if (showShareTutorial) handleCloseTutorial();
              }}
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold animate-pulse hover:animate-none hover:scale-105 transition-all shadow-[0_0_15px_rgba(220,38,38,0.6)] mr-1 sm:mr-2 relative z-10"
              title="Compartilhar App"
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Compartilhar</span>
            </button>

            <AnimatePresence>
              {showShareTutorial && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                  className="absolute top-full right-0 mt-4 w-72 sm:w-80 bg-zinc-900 border border-zinc-700/50 rounded-xl p-5 shadow-[0_0_40px_rgba(220,38,38,0.25)] z-50"
                >
                  {/* Seta apontando para cima */}
                  <div className="absolute -top-2 right-12 w-4 h-4 bg-zinc-900 border-t border-l border-zinc-700/50 transform rotate-45"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-white flex items-center gap-2 text-base">
                        <Share2 className="w-4 h-4 text-red-500" />
                        Espalhe a Magia!
                      </h4>
                      <button 
                        onClick={handleCloseTutorial}
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-zinc-300 mb-5 leading-relaxed">
                      Compartilhe o <strong>CINEMAHOME</strong> com seus amigos e familiares para que eles também possam curtir filmes e séries de graça!
                    </p>
                    <button 
                      onClick={handleCloseTutorial}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-lg transition-colors"
                    >
                      Entendi
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/admin" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <Link to="/login" className="hover:text-gray-300 text-sm font-medium hidden sm:block">Entrar</Link>
          <Link to="/plan" className="bg-red-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition-colors hidden sm:block">Assinar</Link>
        </div>
      </nav>
      <main className="flex-1">{children}</main>

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
