// src/services/categoria.service.ts
import api from '../Service/API';
import { Categoria } from '../Service/categoria';


export const categoriaService = {
  
  // Obtener todas las categorías
  getAll: async (): Promise<Categoria[]> => {
    try {
      const response = await api.get<Categoria[]>('/categoria/crearCategorias');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categorías', error);
      throw error;
    }
  },

  // Obtener una categoría por id
  getById: async (id: number): Promise<Categoria> => {
    try {
      const response = await api.get<Categoria>(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo categoría ${id}`, error);
      throw error;
    }
  },

  // Crear una nueva categoría
  create: async (data: Categoria): Promise<Categoria> => {
    try {
      const response = await api.post<Categoria>('/categorias', data);
      return response.data;
    } catch (error) {
      console.error('Error creando categoría', error);
      throw error;
    }
  },

  // Actualizar categoría por id
  update: async (id: number, data: Partial<Categoria>): Promise<Categoria> => {
    try {
      const response = await api.put<Categoria>(`/categorias/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando categoría ${id}`, error);
      throw error;
    }
  },

  // Eliminar categoría por id
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/categorias/${id}`);
    } catch (error) {
      console.error(`Error eliminando categoría ${id}`, error);
      throw error;
    }
  }
};
