// app/Service/auth/authService.ts
import api from '../API';

export const authService = {

  login: async (payload: { email: string; password: string }) => {
    try {
      const res = await api.post('/usuario/login', payload);
      const data = res.data;

      if (data?.error) {
        throw new Error(data.error);
      }

      // Si la API devuelve token -> guardalo
      if (data?.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
      }

      return data;
    } catch (error: any) {
      const backendMsg = error?.response?.data?.error || error?.response?.data?.message;
      if (backendMsg) throw new Error(backendMsg);
      if (error instanceof Error) throw error;
      throw new Error('Error en login');
    }
  },
};

export default authService;
