import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../stores/auth';

export function AdminRoute() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}