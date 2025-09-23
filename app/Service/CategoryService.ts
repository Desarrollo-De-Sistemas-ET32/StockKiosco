// app/Service/CategoryService.ts
import api from './API';
import { CategoriaPayload, CategoriaWithId } from './categoria';

export const categoriaService = {
  // Obtener todas las categorías
  getAll: async (): Promise<CategoriaWithId[]> => {
    try {
      const response = await api.get('/categoria/leerCategoria');
      const data = response.data;

      // Normalizar: la API puede devolver directamente un array o un objeto { categorias: [] }
      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data.categorias)) {
        return data.categorias;
      }

      // Caso fallback: si viene { message, categoria } (un solo objeto), devolver arreglo con ese objeto
      if (data && data.categoria && typeof data.categoria === 'object') {
        return [data.categoria];
      }

      // Si no hay nada reconocible, devolver array vacío
      return [];
    } catch (error) {
      console.error('Error obteniendo categorías', error);
      throw error;
    }
  },

  // Obtener una categoría por id
  getById: async (id: number): Promise<CategoriaWithId | null> => {
    try {
      const response = await api.get(`/categoria/${id}`);
      return response.data ?? null;
    } catch (error) {
      console.error(`Error obteniendo categoría ${id}`, error);
      throw error;
    }
  },

  // Crear una nueva categoría
  create: async (data: CategoriaPayload): Promise<{ message: string; categoria: CategoriaWithId }> => {
    try {
      const response = await api.post<{ message: string; categoria: CategoriaWithId }>(
        '/categoria/crearCategoria',
        data
      );
      return response.data; // { message, categoria }
    } catch (error) {
      console.error('Error creando categoría', error);
      throw error;
    }
  },

  // Actualizar categoría por id
  update: async (id: number, data: Partial<CategoriaPayload>): Promise<CategoriaWithId> => {
    try {
      const response = await api.put<CategoriaWithId>(`/categoria/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando categoría ${id}`, error);
      throw error;
    }
  },

  // Eliminar categoría por id
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/categoria/${id}`);
    } catch (error) {
      console.error(`Error eliminando categoría ${id}`, error);
      throw error;
    }
  }
};
