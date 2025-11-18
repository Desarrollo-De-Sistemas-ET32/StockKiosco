// app/Service/usuario/UsuarioService.ts
import api from '../API';
import type { UsuarioPayload, UsuarioWithId } from './usuario';

export const usuarioService = {

  addUsuario: async (
    payload: UsuarioPayload
  ): Promise<UsuarioWithId> => {
    try {
      const response = await api.post('/usuario/agregarUsuario', payload);
      const data = response.data;

      if (data?.error) {
        throw new Error(data.error);
      }


      if (data?.usuario) return data.usuario;

      if (data?.data) return data.data;

      return data;
    } catch (error: any) {
      console.error('Error registrando usuario (addUsuario):', error);

      const backendMsg = error?.response?.data?.error || error?.response?.data?.message;
      if (backendMsg) throw new Error(backendMsg);

      if (error instanceof Error) throw error;

      throw new Error('Error registrando usuario');
    }
  },

  //Obtener usuario por email
  getByEmail: async (email: string): Promise<UsuarioWithId | null> => {
    try {
      const response = await api.get('/usuario/by-email', { params: { email } });
      const data = response.data;
      if (data?.error) {
        throw new Error(data.error);
      }
      return data ?? null;
    } catch (error) {
      console.error(`Error obteniendo usuario por email ${email}:`, error);
      throw error;
    }
  },
};

export default usuarioService;
