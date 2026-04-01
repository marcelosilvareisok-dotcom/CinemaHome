import { CheckCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlanSuccess() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Assinatura Concluída!</h1>
        
        <p className="text-zinc-400 mb-8 text-lg">
          Bem-vindo ao CINEMAHOME Premium. Seus 30 dias grátis já começaram. 
          Aproveite o melhor do cinema!
        </p>

        <Link 
          to="/"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg text-lg transition-colors flex justify-center items-center gap-2"
        >
          <Play className="w-6 h-6 fill-current" />
          Começar a Assistir
        </Link>
      </div>
    </div>
  );
}
