import React from 'react';

interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  return (
    <div className={`w-full max-w-5xl mx-auto bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden ${className}`}>
      <span className="absolute top-2 right-2 text-[10px] text-zinc-500 uppercase tracking-widest">Publicidade</span>
      <div className="py-6 text-zinc-600 flex flex-col items-center gap-2">
        {/* 
          Aqui é onde você vai colar o script do seu provedor de anúncios no futuro.
          Exemplo (Google AdSense):
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXXX" data-ad-slot="XXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins>
        */}
        <span className="text-sm font-medium">Espaço Publicitário</span>
        <span className="text-xs opacity-70 max-w-md">
          Este espaço está reservado para os seus anúncios (Google AdSense, PopAds, etc). 
          O código real do anúncio será inserido aqui.
        </span>
      </div>
    </div>
  );
}
