import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './components/MainLayout';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';
import { PublicLayout } from './components/PublicLayout';
import { useEffect } from 'react';
import { useAuth } from './stores/auth';

// Páginas públicas
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ServerDown } from './pages/ServerDown';
import { NotFound } from './pages/NotFound';
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { RequestReset } from './pages/ResetPassword/RequestReset';
import { VerifyCode } from './pages/ResetPassword/VerifyCode';
import { NewPassword } from './pages/ResetPassword/NewPassword';

// Páginas privadas
import { Home } from './pages/Home';
import { EventsList } from './pages/EventsList';
import { UserProfile } from './pages/UserProfile';
import { LiveChat } from './pages/LiveChat';
import { Settings } from './pages/Settings';

// Páginas de admin
import { DashboardPage } from './pages/DashboardPage';
//import { CreateEvent } from './pages/CreateEvent';

export default function App() {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 5000, // Aumentado para 5 segundos
          style: {
            background: '#1f2937',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 5000,
            style: {
              background: '#065f46',
              color: '#fff',
            },
          },
          error: {
            duration: 6000, // Erros ficam mais tempo
            style: {
              background: '#991b1b',
              color: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Rotas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/reset-password" element={<RequestReset />} />
          <Route path="/reset-password/verify" element={<VerifyCode />} />
          <Route path="/reset-password/new" element={<NewPassword />} />
        </Route>

        <Route path="/server-down" element={<ServerDown />} />

        {/* Rotas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/chat" element={<LiveChat />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Rotas de admin */}
            <Route element={<AdminRoute />}>
              {/* Outras rotas exclusivas de admin podem ficar aqui */}
            </Route>
          </Route>
        </Route>

        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}