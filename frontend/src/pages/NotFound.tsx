import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-lg text-gray-600">Página não encontrada</p>
      <Link
        to="/"
        className="mt-4 text-indigo-600 hover:text-indigo-500"
      >
        Voltar para home
      </Link>
    </div>
  );
}
