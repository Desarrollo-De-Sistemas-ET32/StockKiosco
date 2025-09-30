// app/Service/API.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api', // tu API
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Verificar que estamos en el cliente antes de acceder a localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      // Garantizar que headers no sea undefined
      config.headers = config.headers ?? {};
      if (token) {
        // @ts-ignore (axios typings can ser pedorros con InternalAxiosRequestConfig.headers)
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
