// app/Service/ProductoService.ts
import api from '../API';
import { ProductoPayload, ProductoWithId, CreateProductResponse } from './producto';

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
      else if (data && data.proveedores) productos = data.proveedores; // fallback improbable

      const productosNormalizados = productos.map((p) => ({
        ...p,
        precio: p.precio !== undefined && p.precio !== null ? p.precio.toString() : "0",
        descripcion: p.descripcion ?? '',
        stock: Array.isArray(p.stock)
          ? p.stock.map((s: any) => ({
              id_stock: Number(s.id_stock ?? s.id ?? 0),
              cantidad: Number(s.cantidad ?? 0),
              cantidad_min: Number(s.cantidad_min ?? s.cantidad_minima ?? 0),
            }))
          : [],
        fecha_creacion: p.fecha_creacion ? new Date(p.fecha_creacion) : null,
        fecha_actualizacion: p.fecha_actualizacion ? new Date(p.fecha_actualizacion) : null,
      }));
      
      return productosNormalizados;
    } catch (error) {
      console.error('Error obteniendo productos', error);
      throw error;
    }
  },

  // Obtener un producto por id (ruta estándar en muchos backends)
  getById: async (id: number): Promise<ProductoWithId | null> => {
    try {
      const response = await api.get(`/producto/${id}`);
      return response.data ?? null;
    } catch (error: any) {
      // si no existe la ruta exacta, devolvemos null para que el frontend haga fallback
      if (error?.response?.status === 404) return null;
      console.error(`Error obteniendo producto ${id}`, error);
      throw error;
    }
  },

  // Crear un nuevo producto
  create: async (data: ProductoPayload): Promise<CreateProductResponse> => {
    try {
      const response = await api.post<CreateProductResponse>('/producto/crearProducto', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creando producto', error);
      if (error.response?.data?.error) {
        return { error: error.response.data.error };
      }
      throw error;
    }
  },

  // Actualizar producto por PATCH (usa la ruta coherente /producto/editarProducto)
  updatePatch: async (data: Partial<ProductoPayload> & { id_producto: number }): Promise<ProductoWithId> => {
  try {
    const response = await api.patch('/producto/editarProducto', data);
    return response.data;
  } catch (error: any) {
    // intento de extraer el body del error para mostrarlo en frontend
    const resp = error?.response;
    const status = resp?.status;
    const contentType = resp?.headers?.['content-type'] ?? resp?.headers?.['Content-Type'];
    let serverBody: any = null;

    try {
      if (resp?.data) serverBody = resp.data;
      else if (typeof resp?.text === 'function') {
        serverBody = await resp.text();
      }
    } catch (e) {
      serverBody = resp?.data ?? resp?.statusText ?? String(error);
    }

    console.error(`productoService.updatePatch failed (status ${status})`, serverBody ?? error);
    // Lanzamos un error con datos útiles
    const err = new Error(
      serverBody && typeof serverBody === 'object'
        ? JSON.stringify(serverBody)
        : String(serverBody ?? error.message ?? error)
    );
    // @ts-ignore
    err.status = status;
    throw err;
  }
},

  // Eliminar producto por id
  // Intentamos DELETE /producto/{id} y si falla, intentamos POST /producto/eliminarProducto con { id_producto }
delete: async (id: number): Promise<void> => {
  try {
    // Llamada principal: método DELETE a /producto/eliminarProducto
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
