// app/Service/producto.ts
export interface Stock {
  id_stock: number;
  cantidad: number;
  cantidad_min: number;
}

export interface MarcaProducto {
  id_marca: number;
  nombre_marca: string;
}

export interface CategoriaProducto {
  id_categoria: number;
  nombre: string;
}


export interface ProductoWithId {
  id_producto: number;
  nombre: string;
  precio: number;
  codigo_barra: string | null;
  images: string | null;
  
  stock: Stock[]; 
  marcas: MarcaProducto | null;
  categoria: CategoriaProducto | null;

  id_marca: number | null;
  id_categoria: number | null;
  id_proveedor: number | null;

  fecha_creacion?: string;
  fecha_actualizacion?: string;
  
  success?: boolean;
  message?: string;
}

export interface ProductoPayload {
  id_producto?: number; 
  nombre: string;
  precio: number;
  codigo_barra: string;
  images: string;

  stock_cantidad: number;
  stock_minimo: number;

  id_marca: number | null;
  id_categoria: number | null;
  id_proveedor?: number | null;
}


export interface CreateProductResponse {
  success?: boolean;
  error?: string;
  message?: string;
  producto?: ProductoWithId;
}