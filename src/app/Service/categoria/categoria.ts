// app/Service/categoria.ts
export interface CategoriaPayload {
  nombre: string;
}

// Categoria tal como puede venir del backend (id opcional)
export interface CategoriaWithId {
  id_categoria: number;
  nombre: string;
}
