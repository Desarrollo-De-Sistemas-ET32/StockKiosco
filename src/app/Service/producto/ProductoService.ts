// app/Service/ProductoService.ts
import api from '../API';
import { ProductoPayload, ProductoWithId, CreateProductResponse } from './producto';

export const productoService = {
  // Obtener todos los productos
  getAll: async (): Promise<ProductoWithId[]> => {
    try {
      const response = await api.get('/producto/leerProducto'); // ruta del backend
      const data = response.data;

      // Normalizar la respuesta
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.products)) return data.products;
      if (data && data.product && typeof data.product === 'object') return [data.product];

      return [];
    } catch (error) {
      console.error('Error obteniendo productos', error);
      throw error;
    }
  },

  // Obtener un producto por id
  getById: async (id: number): Promise<ProductoWithId | null> => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data ?? null;
    } catch (error) {
      console.error(`Error obteniendo producto ${id}`, error);
      throw error;
    }
  },

  // Crear un nuevo producto
  create: async (data: ProductoPayload): Promise<CreateProductResponse> => {
    try {
      const response = await api.post<CreateProductResponse>(
        '/producto/crearProducto',
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creando producto', error);
      if (error.response?.data?.error) {
        return { error: error.response.data.error };
      }
      throw error;
    }
  },

  // Actualizar producto por PATCH
  updatePatch: async (data: Partial<ProductoPayload> & { id_producto: number }): Promise<any> => {
    try {
      const response = await api.patch('/api/producto/editarProducto', data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando producto ${data.id_producto}`, error);
      throw error;
    }
  },

  // Eliminar producto por id
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/productos/${id}`);
    } catch (error) {
      console.error(`Error eliminando producto ${id}`, error);
      throw error;
    }
  }
};
