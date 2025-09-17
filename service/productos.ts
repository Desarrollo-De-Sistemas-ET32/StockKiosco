import api from './api'
//import { productProps } from '@/types/product'

/*interface ProductResponse {
  success: boolean;
  data: productProps[];
  message?: string;
}*/

const productService = {
  readProducts: async () => {
    const response = await api.get('producto/leerProducto');
    return response;
  },

  deleteProduct: async (codigo_barra: number) => {
    const response = await api.delete('producto/eliminarProducto', {
    data: { codigo_barra }
  });
    return response;
  },

  editProducto: async (id: number, updateData: {
    nombre?: string;
    precio?: string;
    codigo_barra?: number;
    fecha_actualizacion?: Date;
    proveedor?: number;
  }) => {
    const response = await api.patch('proveedor/editarProductor', {
        data: { 
            id, 
            ...updateData 
        }
    });
  },


  addProduct: async (
    nombre: string,
    precio: string,
    codigo_barra: number,
    fecha_actualizacion: Date,
    proveedor:  number) => {
    
      const response = await api.post('producto/crearProducto', {
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

export default productService;