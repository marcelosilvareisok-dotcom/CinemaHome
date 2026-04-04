import React, { useState, useEffect } from 'react';
import { usePremium } from '../context/PremiumContext';
import { X } from 'lucide-react';

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  const { isPremium } = usePremium();
  const [isVisible, setIsVisible] = useState(true);

  // Se for premium ou fechou o anúncio, não mostra
  if (isPremium || !isVisible) return null;

  return (
    <div className={`w-full max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg p-2 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg ${className}`}>
      <div className="absolute top-1 right-1 flex items-center gap-2 z-10">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded">Publicidade</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-zinc-400 hover:text-white bg-black/50 rounded-full p-1 transition-colors"
          title="Fechar anúncio"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      
      <div className="w-full h-[100px] md:h-[150px] bg-zinc-800/80 flex flex-col items-center justify-center rounded border border-dashed border-zinc-700 relative group cursor-pointer hover:bg-zinc-800 transition-colors">
        {/* Placeholder for real ad script */}
        <div className="text-zinc-500 flex flex-col items-center gap-1">
          <span className="text-sm font-bold text-zinc-400">Espaço Reservado para Anúncio</span>
          <span className="text-xs opacity-70 max-w-xs">
            Seja Premium para remover todos os anúncios e apoiar o Cinema em Casa!
          </span>
        </div>
        
        {/* Fake "Ad" content for demonstration */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-zinc-900/90 backdrop-blur-sm">
          <span className="text-red-500 font-bold text-sm border border-red-500 px-4 py-1 rounded-full">
            Remover Anúncios (Premium)
          </span>
        </div>
      </div>
    </div>
  );
}
