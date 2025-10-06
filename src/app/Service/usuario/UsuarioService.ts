import api from '../API'
import type { UsuarioPayload, UsuarioWithId } from './usuario'


export const usuarioService = {
/**
* Registra un usuario usando el endpoint `addUsuario`.
* Normaliza formas comunes de respuesta: { message, usuario }, { data: usuario }, usuario directo.
*/
addUsuario: async (
payload: UsuarioPayload
): Promise<UsuarioWithId | { message?: string; usuario?: UsuarioWithId }> => {
try {
const response = await api.post('/addUsuario', payload)
const data = response.data


// 1) { message, usuario }
if (data && data.usuario) return data


// 2) { data: usuario }
if (data && data.data) return data.data


// 3) usuario directo
return data
} catch (error) {
console.error('Error registrando usuario (addUsuario):', error)
throw error
}
},


// función opcional por si querés consultar usuario por email desde frontend
getByEmail: async (email: string): Promise<UsuarioWithId | null> => {
try {
const response = await api.get('/usuario/by-email', { params: { email } })
return response.data ?? null
} catch (error) {
console.error(`Error obteniendo usuario por email ${email}:`, error)
throw error
}
},
}


export default usuarioService