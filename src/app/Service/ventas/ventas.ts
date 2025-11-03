// app/Service/ventas/ventas.ts
export interface DetalleVenta {
  id_producto: number;
  cantidad: number;
}

export interface NuevaVenta {
  id_usuario: number | string | null;
  detalles: DetalleVenta[];
  pagado?: boolean;
}

export interface VentaDBDetalle {
  id_detalle?: number;
  id_venta?: number;
  id_producto: number;
  cantidad?: number;
  precio_unitario?: number | string;
  subtotal?: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface VentaDB {
  id_venta?: number;
  id_usuario?: number;
  fecha_venta?: string;
  total?: number | string;
  pagado?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  detalles_venta?: VentaDBDetalle[];
}

export interface CreateVentaResponse {
  success: boolean;
  message?: string;
  venta?: VentaDB;
  error?: string;
  details?: any;
}
