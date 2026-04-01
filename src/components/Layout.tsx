import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
          <Link to="/admin" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <Link to="/login" className="hover:text-gray-300 text-sm font-medium">Entrar</Link>
          <Link to="/signup" className="bg-red-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-red-700 transition-colors">Assinar</Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
