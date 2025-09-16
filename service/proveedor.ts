import api from './api';
import { providerProps } from '@/types/provider';

const providerService = {
    getProvider: async () => {
        const response = await api.get('provider/verProveedores');
        return response;
    },

    deleteProvider: async (codigo_bbarra: number) => {
        const response = await api.delete('proveedor/eliminarProveedor', {
        data: { codigo_barra }
      });
        return response;
      },
    
      editProvider: async (id: number) => {
        const response = await api.patch('proveedor/editarProveedor', {
        data: { id }
      });
        return response;
      },
    
      addProvider: async (
        nombre: string,
        precio: string,
        codigo_barra: number,
        fecha_actualizacion: Date,
        proveedor:  number) => {
      //proveedor no existe en types, revisar eso en caso de error (o preguntar)
        
          const response = await api.post('proveedor/crearProveedor', {
          data: {
            nombre,
            precio,
            codigo_barra,
            fecha_actualizacion,
            proveedor,
          },
        });
        return response;
      },
};

export default providerService;