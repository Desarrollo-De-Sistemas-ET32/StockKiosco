// app/Service/proveedor.ts

export interface ProveedorPayload {
  nombre: string;
  email: string;
  direccion: string;
  contacto: string;
  telefono: string;
}

// Proveedor tal como puede venir del backend (id opcional)
export interface ProveedorWithId {
  id_proveedor?: number;
  nombre: string;
  email: string;
  direccion: string;
  contacto: string;
  telefono: string;
  // agrega otros campos que devuelva tu API si hace falta (por ejemplo createdAt, updatedAt)
}