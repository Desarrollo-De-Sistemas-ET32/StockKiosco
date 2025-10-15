// app/Service/ProductoService.ts
import api from '../API';
import { ProductoPayload, ProductoWithId, CreateProductResponse } from './producto';

export const productoService = {
  // Obtener todos los productos
getAll: async (): Promise<ProductoWithId[]> => {
  try {
    const response = await api.get('/producto/leerProducto'); // ruta del backend
    console.log(response.data);
    const data = response.data;

    // Extraer los productos del objeto de respuesta
    let productos: any[] = [];
    if (Array.isArray(data)) productos = data;
    else if (Array.isArray(data.products)) productos = data.products;
    else if (data && data.product && typeof data.product === 'object') productos = [data.product];

    // Normalizar los datos
    const productosNormalizados = productos.map((p) => ({
      ...p,
      // Si precio viene como objeto tipo { d: [{ e: X, s: Y }] }, extraemos el número
      precio:
        typeof p.precio === 'object'
          ? Number(p.precio?.d?.[0]?.e ?? 0)
          : p.precio,
      // Evitar que stock o descripción sean undefined
      descripcion: p.descripcion ?? '',
      stock: Array.isArray(p.stock) ? p.stock : [],
      fecha_creacion: new Date(p.fecha_creacion),
      fecha_actualizacion: new Date(p.fecha_actualizacion),
    }));

    return productosNormalizados;
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
