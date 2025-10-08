export interface UsuarioPayload {
nombre: string
email: string
password: string
}


export interface UsuarioWithId {
id_usuario?: number
nombre: string
email: string
createdAt?: string
// otros campos opcionales que devuelva tu API
}


