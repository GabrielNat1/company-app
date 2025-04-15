import { useEffect } from 'react';
import { useAuth } from '../stores/auth';
import { useEvents } from '../stores/events';
import { Link } from 'react-router-dom';

export function Home() {
  const { user } = useAuth();
  const { events, fetchEvents, isLoading } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-white">
          Bem-vindo(a), {user.name}!
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card de Eventos */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-white">Eventos</h3>
              {isLoading ? (
                <p className="text-gray-400">Carregando eventos...</p>
              ) : (
                <p className="mt-1 text-sm text-gray-400">
                  {events.length} eventos disponíveis
                </p>
              )}
              <Link
                to="/events"
                className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Ver todos os eventos →
              </Link>
            </div>
          </div>

          {/* Card de Chat */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-white">Chat</h3>
              <p className="mt-1 text-sm text-gray-400">
                Converse com outros participantes
              </p>
              <Link
                to="/chat"
                className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Ir para o chat →
              </Link>
            </div>
          </div>

          {/* Card de Perfil */}
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-white">Seu Perfil</h3>
              <p className="mt-1 text-sm text-gray-400">
                Gerencie suas informações
              </p>
              <Link
                to="/profile"
                className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Editar perfil →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
