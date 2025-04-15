import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../stores/auth';

export function PrivateRoute() {
  const { user, isLoading } = useAuth();

  // Aguardar o carregamento inicial
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}