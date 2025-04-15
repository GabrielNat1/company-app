import { create } from 'zustand';
import { api } from '../lib/axios';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string, mfaCode?: string) => Promise<User | void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
  resetPassword: (email: string, password: string) => Promise<void>;
  setNewPassword: (email: string, code: string, newPassword: string) => Promise<void>;
};

type SignUpData = {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  phone: string;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      if (!token) {
        set({ user: null });
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get<User>('/auth/me');
      set({ user: response.data });
    } catch {
      localStorage.removeItem('token');
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password, mfaCode) => {
    try {
      set({ isLoading: true });
      const response = await api.post<{ token: string; user: User }>('/auth/login', { 
        email, 
        password, 
        mfaCode 
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user });
      return user;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (data) => {
    try {
      set({ isLoading: true });
      await api.post('/auth/register', data);
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },

  resetPassword: async (email, password) => {
    try {
      set({ isLoading: true });
      await api.post('/auth/reset-password', { email, password });
    } finally {
      set({ isLoading: false });
    }
  },

  setNewPassword: async (email, code, newPassword) => {
    try {
      set({ isLoading: true });
      await api.post('/auth/reset-password/new', { email, code, newPassword });
    } finally {
      set({ isLoading: false });
    }
  },
}));