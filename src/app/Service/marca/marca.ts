export interface MarcaPayload {
  nombre_marca: string;
  fecha_creacion?: Date | string;
  fecha_actualizacion?: Date | string;
}

export interface MarcaWithId {
  id_marca: number;
  nombre_marca: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface CreateMarcaResponse {
  marca?: MarcaWithId;
  error?: Record<string, string>;
}