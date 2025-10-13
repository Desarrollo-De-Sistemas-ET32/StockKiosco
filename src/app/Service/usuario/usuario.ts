// app/Service/usuario/usuario.ts
export interface UsuarioPayload {
  nombre: string; // tu form usa `nombre`
  email: string;
  password: string;
}

export interface UsuarioWithId {
  id_usuario?: number;
  nombre?: string;
  name?: string; // por compatibilidad
  email: string;
  createdAt?: string;
  // otros campos opcionales que devuelva tu API
}
