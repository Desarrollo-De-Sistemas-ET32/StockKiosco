// app/Service/proveedor/ProveedorService.ts
import api from '../API'
import type { ProveedorPayload, ProveedorWithId } from './proveedor'

type CreateResp = { message?: string; proveedor?: ProveedorWithId } | ProveedorWithId
type GenericResp = { success?: boolean; message?: string; proveedor?: ProveedorWithId; error?: any }

const normalizeList = (raw: any): ProveedorWithId[] => {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw.proveedores)) return raw.proveedores
  if (Array.isArray(raw.data)) return raw.data
  if (raw.proveedor && !Array.isArray(raw.proveedor)) return [raw.proveedor]
  return []
}

export const proveedorService = {
  getAll: async (): Promise<ProveedorWithId[]> => {
    try {
      const response = await api.get('/proveedor/leerProveedor')
      return normalizeList(response.data)
    } catch (error) {
      console.error('Error obteniendo proveedores', error)
      throw error
    }
  },

  /**
   * Dado que no existe GET /proveedor/:id en el backend,
   * buscamos en la lista devuelta por leerProveedor por id_proveedor o id.
   */
  getById: async (id: number): Promise<ProveedorWithId | null> => {
    try {
      const listResp = await api.get('/proveedor/leerProveedor')
      const list = normalizeList(listResp.data)
      const found =
        list.find((x) => Number((x as any).id_proveedor) === Number(id)) ??
        list.find((x) => Number((x as any).id) === Number(id))
      return (found as ProveedorWithId) ?? null
    } catch (err) {
      console.error('Error en getById (fallback leerProveedor):', err)
      throw err
    }
  },

  /**
   * Crear proveedor -> POST /proveedor/agregarProveedor
   */
  create: async (payload: ProveedorPayload): Promise<CreateResp> => {
    try {
      const response = await api.post<CreateResp>('/proveedor/agregarProveedor', payload)
      return response.data
    } catch (err: any) {
      console.error('Error creando proveedor en /proveedor/agregarProveedor', err)
      throw err
    }
  },

  /**
   * Actualizar proveedor -> POST /proveedor/actualizarProveedor
   * El endpoint de backend espera id_proveedor en el body (según tu action),
   * por eso aquí incluimos id_proveedor en el payload.
   * Después intentamos devolver el proveedor actualizado llamando a getById.
   */
  update: async (id: number, payload: ProveedorPayload): Promise<ProveedorWithId | null> => {
    try {
      await api.patch('/proveedor/actualizarProveedor', { id_proveedor: id, ...payload })
      console.log('Proveedor actualizado')
      return await proveedorService.getById(id);
    } catch (err) {
      console.error(`Error actualizando proveedor ${id}`, err)
      throw err
    }
  },

  /**
   * Eliminar proveedor -> POST /proveedor/eliminarProveedor
   * Tu acción de borrar espera { name }, por eso buscamos primero el proveedor por id
   * para obtener su nombre y llamar al endpoint con { name }.
   */
  delete: async (id: number): Promise<void> => {
    try {
      // obtener proveedor para conseguir su nombre
      const proveedor = await proveedorService.getById(id)
      if (!proveedor) {
        throw new Error('Proveedor no encontrado para eliminar')
      }
      const name = proveedor.nombre
      const resp = await api.post<GenericResp>('/proveedor/eliminarProveedor', { name })
      if (resp?.data?.success) return
      // si no devolvió success, lanzar error con mensaje del backend si lo hay
      const msg = resp?.data?.message ?? resp?.data?.error ?? 'Error eliminando proveedor'
      throw new Error(String(msg))
    } catch (err) {
      console.error(`Error eliminando proveedor ${id}`, err)
      throw err
    }
  },
}
