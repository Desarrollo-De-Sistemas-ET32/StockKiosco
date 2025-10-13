// app/Service/usuario/UsuarioService.ts
import api from '../API';
import type { UsuarioPayload, UsuarioWithId } from './usuario';

export const usuarioService = {
  /**
   * Registra un usuario usando el endpoint /usuario/agregarUsuario
   * - Lanza Error con mensaje legible si la API devuelve { error: "..." }
   * - Retorna el usuario creado (sin password) en caso de éxito.
   */
  addUsuario: async (
    payload: UsuarioPayload
  ): Promise<UsuarioWithId> => {
    try {
      // Nota: el backend acepta name o nombre (tu route usa name ?? nombre),
      // enviamos tal cual lo tenés en el frontend (nombre)
      const response = await api.post('/usuario/agregarUsuario', payload);
      const data = response.data;

      // Errores que vengan desde el backend
      if (data?.error) {
        // Lanzamos Error para que en el componente `catch(err)` puedas leer err.message
        throw new Error(data.error);
      }

      // Variantes de respuesta:
      // { usuario: { ... } }
      if (data?.usuario) return data.usuario;

      // { data: usuario }
      if (data?.data) return data.data;

      // Respuesta directa
      return data;
    } catch (error: any) {
      console.error('Error registrando usuario (addUsuario):', error);

      // Si es axios y trae response.data.error, lanzalo
      const backendMsg = error?.response?.data?.error || error?.response?.data?.message;
      if (backendMsg) throw new Error(backendMsg);

      // Si ya es un Error con mensaje
      if (error instanceof Error) throw error;

      throw new Error('Error registrando usuario');
    }
  },

  /**
   * Obtener usuario por email (opcional, si tu backend lo soporta)
   */
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
