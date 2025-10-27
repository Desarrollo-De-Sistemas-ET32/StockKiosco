// app/Service/proveedor.ts

export interface ProveedorPayload {
  nombre: string;
  email: string;
  direccion: string;
  contacto: string;
  telefono: string;
}

export interface ProveedorWithId {
  id_proveedor?: number;
  nombre: string;
  email: string;
  direccion: string;
  contacto: string;
  telefono: string;
}
