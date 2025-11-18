// app/Service/usuario/usuario.ts
export interface UsuarioPayload {
  nombre: string;
  email: string;
  password: string;
}

export interface UsuarioWithId {
  id_usuario?: number;
  nombre?: string;
  name?: string; 
  email: string;
  usuarios_roles?: string[];
  createdAt?: string;
}
