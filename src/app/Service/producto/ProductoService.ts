// app/Service/ProductoService.ts
import api from '../API';
import { ProductoPayload, ProductoWithId, CreateProductResponse } from './producto';

export const productoService = {
  // Obtener todos los productos
  getAll: async (): Promise<ProductoWithId[]> => {
    try {
      const response = await api.get('/productos/leerProductos');
      const data = response.data;

      // Normalizar respuesta
      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data.productos)) {
        return data.productos;
      }

      if (data && data.producto && typeof data.producto === 'object') {
        return [data.producto];
      }

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
      
      // Si el backend devuelve errores estructurados
      if (error.response?.data?.error) {
        return { error: error.response.data.error };
      }
      
      throw error;
    }
  },

  // Actualizar producto por id
  update: async (id: number, data: Partial<ProductoPayload>): Promise<ProductoWithId> => {
    try {
      const response = await api.put<ProductoWithId>(`/productos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando producto ${id}`, error);
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