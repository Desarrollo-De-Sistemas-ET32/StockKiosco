// app/Service/CategoryService.ts
import api from '../API';
import { CategoriaPayload, CategoriaWithId } from './categoria';
const normalizeCategoria = (data: any): CategoriaWithId => {
  return {
    id_categoria: Number(data.id_categoria ?? 0),
    nombre: String(data.nombre ?? ""),
  };
};

export const categoriaService = {
  getAll: async (): Promise<CategoriaWithId[]> => {
    try {
      const response = await api.get('/categoria/leerCategoria');
      const data = response.data;

      // Aplicamos la normalización a cualquier array que encontremos
      if (Array.isArray(data)) {
        return data.map(normalizeCategoria); // <-- CORREGIDO
      }

      if (Array.isArray(data.categorias)) {
        return data.categorias.map(normalizeCategoria); // <-- CORREGIDO
      }

      if (data && data.categoria && typeof data.categoria === 'object') {
        return [normalizeCategoria(data.categoria)]; // <-- CORREGIDO
      }

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
      // Aplicamos normalización si la respuesta no es nula
      return response.data ? normalizeCategoria(response.data) : null; // <-- CORREGIDO
    } catch (error) {
      console.error(`Error obteniendo categoría ${id}`, error);
      throw error;
    }
  },

  // Crear una nueva categoría
  create: async (data: CategoriaPayload): Promise<{ message: string; categoria: CategoriaWithId }> => {
    try {
      const response = await api.post<{ message: string; categoria: any }>( // Recibimos 'any'
        '/categoria/crearCategoria',
        data
      );
      // Devolvemos la categoría normalizada
      return {
        message: response.data.message,
        categoria: normalizeCategoria(response.data.categoria) // <-- CORREGIDO
      };
    } catch (error) {
      console.error('Error creando categoría', error);
      throw error;
    }
  },

  // Actualizar categoría por id
  update: async (id: number, data: Partial<CategoriaPayload>): Promise<CategoriaWithId> => {
    try {
      const response = await api.put<any>(`/categoria/${id}`, data); // Recibimos 'any'
      return normalizeCategoria(response.data); // <-- CORREGIDO
    } catch (error) {
      console.error(`Error actualizando categoría ${id}`, error);
      throw error;
    }
  },

  // Eliminar categoría por id (esta función está bien, no devuelve datos)
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/categoria/${id}`);
    } catch (error) {
      console.error(`Error eliminando categoría ${id}`, error);
      throw error;
    }
  }
};