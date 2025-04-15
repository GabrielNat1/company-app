import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
