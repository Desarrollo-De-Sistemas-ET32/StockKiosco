// app/Service/proveedor/ProveedorService.ts
import api from '@/app/Service/API';
import type { ProveedorPayload, ProveedorWithId } from '@/app/Service/proveedor/proveedor'; // Asumiendo que los tipos están en './proveedor.ts'

type CreateResp = { message?: string; proveedor?: ProveedorWithId } | ProveedorWithId;
type GenericResp = { success?: boolean; message?: string; proveedor?: ProveedorWithId; error?: any };


const normalizeList = (raw: any): ProveedorWithId[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.proveedores)) return raw.proveedores;
  if (Array.isArray(raw.data)) return raw.data;
  if (raw.proveedor && !Array.isArray(raw.proveedor)) return [raw.proveedor];
  
  return [];
};

export const proveedorService = {
  
  /*Obtener todos los proveedores*/
  getAll: async (): Promise<ProveedorWithId[]> => {
    console.log("Obteniendo proveedores...");
    try {
      const response = await api.get('proveedor/leerProveedor');
      const data = response.data;

      console.log('Respuesta CRUDA de /proveedor/leerProveedor:', data);


      return normalizeList(data);
    } catch (err) {
      console.error('Error obteniendo proveedores', err);
      throw err;
    }
  },

  //Obtener un proveedor por ID
  getById: async (id: number): Promise<ProveedorWithId | null> => {
    try {
      const listResp = await api.get('/proveedor/leerProveedor');
      const list = normalizeList(listResp.data);
      
      const found =
        list.find((x) => Number((x as any).id_proveedor) === Number(id)) ??
        list.find((x) => Number((x as any).id) === Number(id));
        
      return (found as ProveedorWithId) ?? null;
    } catch (err) {
      console.error('Error en getById (fallback leerProveedor):', err);
      throw err;
    }
  },

  //Crear proveedor
  create: async (payload: ProveedorPayload): Promise<CreateResp> => {
    try {
      const response = await api.post<CreateResp>('/proveedor/agregarProveedor', payload);
      return response.data;
    } catch (err: any) {
      console.error('Error creando proveedor en /proveedor/agregarProveedor', err);
      throw err;
    }
  },

  //Actualizar proveedor
  update: async (id: number, payload: ProveedorPayload): Promise<ProveedorWithId | null> => {
    try {
      await api.patch('/proveedor/actualizarProveedor', { id_proveedor: id, ...payload });
      console.log('Proveedor actualizado');
      return await proveedorService.getById(id);
    } catch (err) {
      console.error(`Error actualizando proveedor ${id}`, err);
      throw err;
    }
  },

  //Eliminar proveedor
  delete: async (id: number): Promise<void> => {
    try {
      const proveedor = await proveedorService.getById(id);
      if (!proveedor) {
        throw new Error('Proveedor no encontrado para eliminar');
      }
      
      const name = proveedor.nombre;
      const resp = await api.post<GenericResp>('/proveedor/eliminarProveedor', { name });
      
      if (resp?.data?.success) return;

      const msg = resp?.data?.message ?? resp?.data?.error ?? 'Error eliminando proveedor';
      throw new Error(String(msg));
    } catch (err) {
      console.error(`Error eliminando proveedor ${id}`, err);
      throw err;
    }
  },
};