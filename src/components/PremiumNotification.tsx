import { X, Crown } from 'lucide-react';

interface PremiumNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export default function PremiumNotification({ isOpen, onClose, feature }: PremiumNotificationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-500/20 p-3 rounded-full">
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white text-center mb-2">Recurso Premium</h3>
        <p className="text-zinc-400 text-center mb-6">
          O recurso <span className="font-semibold text-white">{feature}</span> é exclusivo para assinantes do plano Premium.
        </p>
        
        <button 
          onClick={() => { onClose(); /* Navigate to plan page */ }}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition-colors"
        >
          Assinar Premium Agora
        </button>
      </div>
    </div>
  );
}
