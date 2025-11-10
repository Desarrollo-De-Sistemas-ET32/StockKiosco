// app/Service/producto.ts

// Payload que envías a la API externa
export interface ProductoPayload {
  id_producto: number | null,
  nombre: string,
  codigo_barra: string,
  precio: number,
  images: string,
  stock_cantidad: number,
  stock_minimo: number,
  marca_id: number | null,
  categoria_id: number | null,
}

// Producto tal como viene del backend
export interface ProductoWithId {
  marcas: any;
  categoria: any;
  success: boolean;
  message: string;
  id_producto: number;
  nombre: string;
  codigo_barra: string;
  precio: number;
  stock: { id_stock: number; cantidad: number ; cantidad_min: number }[];
  fecha_creacion: string;
  fecha_actualizacion: string;
  id_proveedor: number;
  id_marca?: number | null;
  id_categoria: number;
  images: string;
}

// Respuesta de la API al crear producto
export interface CreateProductResponse {
  product?: ProductoWithId;
  error?: Record<string, string>;
}