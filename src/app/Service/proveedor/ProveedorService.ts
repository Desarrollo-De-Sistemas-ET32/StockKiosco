// app/Service/proveedor/ProveedorService.ts
import api from '../API'
import type { ProveedorPayload, ProveedorWithId } from './proveedor'

type CreateResp = { message?: string; proveedor?: ProveedorWithId } | ProveedorWithId

export const proveedorService = {
  getAll: async (): Promise<ProveedorWithId[]> => {
    try {
      const response = await api.get('/proveedor/leerProveedor')
      const data = response.data

      if (Array.isArray(data)) return data
      if (Array.isArray((data as any).proveedores)) return (data as any).proveedores
      if (data && (data as any).proveedor && !Array.isArray((data as any).proveedor)) return [(data as any).proveedor]
      if (data && Array.isArray((data as any).data)) return (data as any).data
      return []
    } catch (error) {
      console.error('Error obteniendo proveedores', error)
      throw error
    }
  },

  getById: async (id: number): Promise<ProveedorWithId | null> => {
    try {
      const response = await api.get(`/proveedor/${id}`)
      const data = response.data
      if (!data) return null
      if ((data as any).proveedor) return (data as any).proveedor as ProveedorWithId
      if ((data as any).data) return (data as any).data as ProveedorWithId
      if (typeof data === 'object' && !Array.isArray(data)) return data as ProveedorWithId
      return null
    } catch (error: any) {
      if (error?.response?.status === 404) return null
      console.error(`Error obteniendo proveedor ${id}`, error)
      throw error
    }
  },

  /**
   * Crear proveedor
   * Intentará primero /proveedor/agregarProveedor y, si responde 404, intentará /proveedor/crearProveedor
   */
  create: async (payload: ProveedorPayload): Promise<CreateResp> => {
    const pathsToTry = ['/proveedor/agregarProveedor', '/proveedor/crearProveedor']
    let lastError: any = null

    for (const path of pathsToTry) {
      try {
        const response = await api.post<CreateResp>(path, payload)
        return response.data
      } catch (err: any) {
        lastError = err
        // si es 404, probamos la siguiente ruta; si es otro error lo volvemos a lanzar
        const status = err?.response?.status
        if (status && status === 404) {
          // continuar al siguiente intento
          continue
        }
        // para otros códigos de error, romper y lanzar
        console.error(`Error creando proveedor en ${path}`, err)
        throw err
      }
    }

    // si llegamos acá, todas las rutas fallaron (probablemente 404)
    console.error('No se pudo crear proveedor. Último error:', lastError)
    throw lastError ?? new Error('No se pudo crear proveedor')
  },

  update: async (id: number, data: Partial<ProveedorPayload>): Promise<ProveedorWithId> => {
    try {
      const response = await api.put(`/proveedor/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error actualizando proveedor ${id}`, error)
      throw error
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/proveedor/${id}`)
    } catch (error) {
      console.error(`Error eliminando proveedor ${id}`, error)
      throw error
    }
  },
}
