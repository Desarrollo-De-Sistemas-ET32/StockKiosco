import api from './api'
import { productProps } from '@/types/product'

interface ProductResponse {
  success: boolean;
  data: productProps[];
  message?: string;
}

const productService = {
  getProducts: async () => {
    const response = await api.get('producto/verProductos');
    return response;
  },

  deleteProduct: async (codigo_barra: number) => {
    const response = await api.delete('producto/eliminarProducto', {
    data: { codigo_barra }
  });
    return response;
  },

  editProduct: async (id: number) => {
    const response = await api.patch('producto/editarProducto', {
    data: { id }
  });
    return response;
  },

  addProduct: async (
    nombre: string,
    precio: string,
    codigo_barra: number,
    fecha_actualizacion: Date,
    proveedor:  number) => {
  //proveedor no existe en types, revisar eso en caso de error (o preguntar)
    
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