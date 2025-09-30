// app/Service/producto.ts

// Payload que envías a la API externa
export interface ProductoPayload {
  nombre: string;
  precio: number;
  codigo_barra: string;
  fecha_actualizacion: Date | string;
  id_proveedor: number;
  id_marca?: number | null;
  categoria: string; // nombre de la categoría
  images?: string | null;
  stock: number;
}

// Producto tal como viene del backend
export interface ProductoWithId {
  id_producto?: number;
  nombre: string;
  precio: number;
  codigo_barra: string;
  fecha_actualizacion: string | Date;
  id_proveedor: number;
  id_marca?: number | null;
  id_categoria: number;
  images?: string | null;
}

// Respuesta de la API al crear producto
export interface CreateProductResponse {
  product?: ProductoWithId;
  error?: Record<string, string>;
}