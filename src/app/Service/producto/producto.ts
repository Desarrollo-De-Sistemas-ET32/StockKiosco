// app/Service/producto.ts

// Payload que envías a la API externa
export interface ProductoPayload {
  nombre: string;
  codigo_barra: string | bigint;
  precio: number;
  stock: { id_stock: number; cantidad: number }[];
  categoria: string; // nombre de la categoría (el backend busca por nombre)
  images?: string;
  stock_minimo?: number;
  fecha_creacion?: Date | string;
  fecha_actualizacion?: Date | string;
  id_proveedor: number;
  id_marca?: number;
  marca: string; // nombre de la marca (el backend busca por nombre)
}

// Producto tal como viene del backend
export interface ProductoWithId {
  id_producto?: number;
  nombre: string;
  codigo_barra: string;
  precio: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
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