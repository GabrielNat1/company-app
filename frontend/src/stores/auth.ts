import create from 'zustand';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      set({ isAuthenticated: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false });
  },
}));
