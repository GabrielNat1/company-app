import { Outlet, Link } from 'react-router-dom';
import { Calendar, LayoutDashboard, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../stores/auth';

export function Layout() {
  const { user, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-2 text-gray-900">
                <Calendar className="h-6 w-6" />
                <span className="ml-2 text-xl font-semibold">EventHub</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAdmin && (
                <>
                  <Link
                    to="/events/new"
                    className="inline-flex items-center text-gray-700 hover:text-gray-900"
                  >
                    <PlusCircle className="h-5 w-5 mr-1" />
                    New Event
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center text-gray-700 hover:text-gray-900"
                  >
                    <LayoutDashboard className="h-5 w-5 mr-1" />
                    Dashboard
                  </Link>
                </>
              )}
              <button
                onClick={signOut}
                className="inline-flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}