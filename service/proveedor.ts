import api from './api';
//import { providerProps } from '@/types/provider';

const providerService = {
    getProvider: async () => {
        const response = await api.get('provider/verProveedores');
        return response;
    },

    deleteProvider: async (nombre: string) => {
        const response = await api.delete('proveedor/eliminarProveedor', {
        data: { nombre }
      });
        return response;
      },
    
      editProvider: async (id: number, updateData:{
        nombre?: string,
        contacto?: string,
        telefono?: string,
        email?: string,
        direccion?: string
      }) => {
        const response = await api.patch('proveedor/editarProveedor', {
        data: { id }
      });
        return response;
      },
    
      addProduct: async (
        nombre: string,
        fecha_creación: Date,
        contacto?: string,
        telefono?: string,
        email?: string,
        direccion?: string,
    ) => {
    
      const response = await api.post('producto/crearProducto', {
      data: {
        nombre,
        contacto,
        telefono,
        email,
        direccion,
        fecha_creación,
      },
    });
    return response;
  },
};

export default providerService;