// 1. Tipos auxiliares para objetos anidados (lo que viene dentro de 'producto' desde la BD)
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

// =============================================================================
// 2. ProductoWithId (PARA LEER)
// Este es el objeto COMPLETO que recibes del backend (Service.getAll o getById).
// Coincide con la estructura de tu función 'normalizeProducto'.
// =============================================================================
export interface ProductoWithId {
  id_producto: number;
  nombre: string;
  precio: number;
  codigo_barra: string | null;
  images: string | null;
  
  // Arrays y Objetos anidados
  stock: Stock[]; 
  marcas: MarcaProducto | null;
  categoria: CategoriaProducto | null;

  // IDs planos (útiles para referencias rápidas)
  id_marca: number | null;
  id_categoria: number | null;
  id_proveedor: number | null;

  // Metadatos
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  
  // Propiedades de respuesta API (opcionales)
  success?: boolean;
  message?: string;
}

// =============================================================================
// 3. ProductoPayload (PARA ESCRIBIR)
// Este es el objeto del FORMULARIO. Es más "plano" y simple.
// Es lo que envías al backend para Crear o Editar.
// =============================================================================
export interface ProductoPayload {
  id_producto?: number; // Opcional, porque al crear uno nuevo no tienes ID aún
  nombre: string;
  precio: number;
  codigo_barra: string;
  images: string;

  // En el formulario, el stock lo manejas como números sueltos, no como array
  stock_cantidad: number;
  stock_minimo: number;

  // IDs para conectar con las otras tablas
  id_marca: number | null;
  id_categoria: number | null;
  id_proveedor?: number | null;
}

// =============================================================================
// 4. Respuesta de Creación (Opcional)
// Útil para el retorno de productoService.create
// =============================================================================
export interface CreateProductResponse {
  success?: boolean;
  error?: string;
  message?: string;
  producto?: ProductoWithId;
}