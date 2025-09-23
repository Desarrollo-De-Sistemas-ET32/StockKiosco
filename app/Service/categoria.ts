// app/Service/categoria.ts
export interface CategoriaPayload {
  nombre: string;
}

// Categoria tal como puede venir del backend (id opcional)
export interface CategoriaWithId {
  id_categoria?: number;
  nombre: string;
  // agrega otros campos que devuelva tu API si hace falta (por ejemplo createdAt)
}
