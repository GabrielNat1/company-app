import { useNavigate } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import { api } from '../lib/axios';

export function ServerDown() {
  const navigate = useNavigate();

  const handleRetry = async () => {
    try {
      await api.get('/health');
      navigate('/sign-in', { replace: true });
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center px-4">
      <div className="animate-bounce-slow">
        <WifiOff className="h-24 w-24 text-indigo-500" />
      </div>
      
      <h1 className="mt-8 text-3xl font-bold text-gray-900 text-center">
        Oops! O servidor está descansando
      </h1>
      
      <p className="mt-4 text-lg text-gray-600 text-center max-w-md">
        Não se preocupe, a culpa não é sua! Nosso servidor está tirando uma soneca rápida.
        Voltaremos em breve.
      </p>

      <button
        onClick={() => handleRetry()}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}