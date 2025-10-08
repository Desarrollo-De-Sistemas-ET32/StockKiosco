// app/Service/ProveedorService.ts
import api from '../API'
import { ProveedorPayload, ProveedorWithId } from './proveedor';

export const proveedorService = {
  // Obtener todos los proveedores
  getAll: async (): Promise<ProveedorWithId[]> => {
    try {
      const response = await api.get('/proveedor/leerProveedor');
      const data = response.data;

      // Normalizar: la API puede devolver directamente un array o un objeto { proveedores: [] }
      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data.proveedores)) {
        return data.proveedores;
      }

      // Caso fallback: si viene { message, proveedor } (un solo objeto), devolver arreglo con ese objeto
      if (data && data.proveedor && typeof data.proveedor === 'object') {
        return [data.proveedor];
      }

      // Si no hay nada reconocible, devolver array vacío
      return [];
    } catch (error) {
      console.error('Error obteniendo proveedores', error);
      throw error;
    }
  },

  // Obtener un proveedor por id
  getById: async (id: number): Promise<ProveedorWithId | null> => {
    try {
      const response = await api.get(`/proveedor/${id}`);
      return response.data ?? null;
    } catch (error) {
      console.error(`Error obteniendo proveedor ${id}`, error);
      throw error;
    }
  },

  // Crear un nuevo proveedor
  create: async (data: ProveedorPayload): Promise<{ message: string; proveedor: ProveedorWithId }> => {
    try {
      const response = await api.post<{ message: string; proveedor: ProveedorWithId }>(
        '/proveedor/crearProveedor',
        data
      );
      return response.data; // { message, proveedor }
    } catch (error) {
      console.error('Error creando proveedor', error);
      throw error;
    }
  },

  // Actualizar proveedor por id
  update: async (id: number, data: Partial<ProveedorPayload>): Promise<ProveedorWithId> => {
    try {
      const response = await api.put<ProveedorWithId>(`/proveedor/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando proveedor ${id}`, error);
      throw error;
    }
  },

  // Eliminar proveedor por id
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/proveedor/${id}`);
    } catch (error) {
      console.error(`Error eliminando proveedor ${id}`, error);
      throw error;
    }
  }
};