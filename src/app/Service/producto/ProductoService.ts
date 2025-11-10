// app/Service/ProductoService.ts
import api from '../API';
import { ProductoPayload, ProductoWithId, CreateProductResponse } from '@/app/Service/producto/producto';

const normalizeProducto = (p: any): ProductoWithId => {
  // 1. Aseguramos que los campos planos sean del tipo correcto
  const id_producto = Number(p.id_producto ?? p.id ?? 0);
  const nombre = String(p.nombre ?? "");
  const precio = Number(p.precio ?? 0); // Lo convertimos a número
  const codigo_barra = String(p.codigo_barra ?? "");
  const images = String(p.images ?? p.imagen ?? ""); // Agregamos fallback 'imagen'

  // 2. Normalizamos el array de stock (tu lógica ya era buena)
  const stock = Array.isArray(p.stock)
    ? p.stock.map((s: any) => ({
        id_stock: Number(s.id_stock ?? s.id ?? 0),
        cantidad: Number(s.cantidad ?? 0),
        cantidad_min: Number(s.cantidad_min ?? s.cantidad_minima ?? 0),
      }))
    : [];
  
  // 3. Normalizamos los objetos anidados 'marcas' y 'categoria'
  const marcas = {
    id_marca: Number(p.marcas?.id_marca ?? p.id_marca ?? 0),
    nombre_marca: String(p.marcas?.nombre_marca ?? ""),
  };

  const categoria = {
    id_categoria: Number(p.categoria?.id_categoria ?? p.id_categoria ?? 0),
    nombre: String(p.categoria?.nombre ?? ""),
  };

  // 4. Devolvemos el objeto limpio y completo
  return {
    id_producto,
    nombre,
    precio,
    codigo_barra,
    images: p.images ?? p.imagen ?? null,
    stock,
    marcas,
    categoria,
    // Devolvemos los IDs planos para que 'openEditModal' los use
    id_marca: marcas.id_marca,
    id_categoria: categoria.id_categoria,
    // Convertimos fechas a string ISO (más estándar que objetos Date)
    fecha_creacion: String(p.fecha_creacion ?? ""),
    fecha_actualizacion: String(p.fecha_actualizacion ?? ""),
    id_proveedor: Number(p.id_proveedor ?? 0),
    success: Boolean(p.success ?? false),
    message: String(p.message ?? ""),
  };
};

export const productoService = {

  // Obtener todos los productos
  getAll: async (): Promise<ProductoWithId[]> => {
    try {
      const response = await api.get('/producto/leerProducto');
      const data = response.data;

      let productos: any[] = [];
      if (Array.isArray(data)) productos = data;
      else if (Array.isArray(data.products)) productos = data.products;
      else if (data && data.product && typeof data.product === 'object') productos = [data.product];
      else if (data && Array.isArray(data.productos)) productos = data.productos;

      // Usamos la función de normalización
      return productos.map(normalizeProducto);

    } catch (error) {
      console.error('Error obteniendo productos', error);
      throw error;
    }
  },

  // Obtener un producto por id
  getById: async (id: number): Promise<ProductoWithId | null> => {
    try {
      const response = await api.get(`/producto/${id}`);
      // Normalizamos la respuesta
      return response.data ? normalizeProducto(response.data) : null;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      console.error(`Error obteniendo producto ${id}`, error);
      throw error;
    }
  },

  // Crear un nuevo producto
  create: async (data: ProductoPayload): Promise<CreateProductResponse> => {
    try {
      // Pedimos 'any' a la API
      const response = await api.post<any>('/producto/crearProducto', data);
      
      // Devolvemos la respuesta, pero con el 'producto' normalizado
      return {
        ...response.data,
        producto: response.data.producto ? normalizeProducto(response.data.producto) : undefined,
      };
    } catch (error: any) {
      console.error('Error creando producto', error);
      if (error.response?.data?.error) {
        return { error: error.response.data.error };
      }
      throw error;
    }
  },

  // Actualizar producto por PATCH
  updatePatch: async (data: Partial<ProductoPayload> & { id_producto: number }): Promise<ProductoWithId> => {
    try {
      // Pedimos 'any' a la API
      const response = await api.patch<any>('/producto/editarProducto', data);
      // Devolvemos el producto normalizado
      return normalizeProducto(response.data);
    } catch (error: any) {
      // (Tu lógica de manejo de errores detallada se mantiene)
      console.error(`productoService.updatePatch failed`, error?.response?.data ?? error);
      throw new Error(error?.response?.data?.message ?? error?.message ?? "Error al actualizar");
    }
  },

  // Eliminar producto por id (no devuelve datos, no necesita normalización)
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete("/producto/eliminarProducto", {
        data: { id_producto: id },
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error(`Error eliminando producto ${id}`, error);
      throw new Error(
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        "Error al eliminar el producto"
      );
    }
  },
};