import axios from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Removido o prefixo @EventHub:
  
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response || error.code === 'ECONNABORTED') {
      window.location.href = '/server-down';
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/sign-in';
      return Promise.reject(error);
    }

    toast.error(error.response?.data?.message || 'Ocorreu um erro inesperado');
    return Promise.reject(error);
  }
);