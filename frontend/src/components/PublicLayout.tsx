import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  );
}
