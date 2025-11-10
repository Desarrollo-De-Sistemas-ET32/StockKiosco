// app/Service/descuento/descuento.ts

export type TipoDescuento = "PORCENTAJE" | "MONTOFIJO";

export interface DescuentoPayload {
  nombre: string;
  descripcion?: string | null;
  tipo: TipoDescuento;
  valor: number | string; // aceptamos string por si el frontend manda input text
  fecha_inicio?: Date | string | null;
  fecha_fin?: Date | string | null;
  activo?: boolean;
}

export interface DescuentoDB {
  id_descuento: number;
  nombre: string;
  descripcion?: string | null;
  tipo: TipoDescuento;
  valor: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
}

export interface CreateDescuentoResponse {
  success?: boolean;
  descuento?: DescuentoDB | null;
  error?: string | Record<string, any>;
}
