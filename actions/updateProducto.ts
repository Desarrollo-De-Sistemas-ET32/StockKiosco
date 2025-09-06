'use server'
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

type filtrado = {
    id_producto: number,
    id_marca: number,
    id_proveedor: number,
    nombre: string,
    codigo_barra: number,
    precio: number,
    fecha_actualizacion: Date
}


export const updateProduct = async(values: { id_producto: number, data: filtrado }) => {
  try {
    const { id_producto, data } = values;

    if (typeof id_producto !== "number" || isNaN(id_producto)) {
      return { 
        success: false, 
        message: "El ID del producto debe ser un número válido." 
      };
    }

    await db.productos.update({
        where: { id_producto: values.id_producto },
        data: {
            nombre: values.data.nombre,
            id_marca: values.data.id_marca,
            id_proveedor: values.data.id_proveedor,
            codigo_barra: values.data.codigo_barra,
            precio: new Prisma.Decimal(10.50), // Si lo necesitas explícito
            fecha_actualizacion: new Date(),
  }
});

    return {
      success: true,
      message: "Producto actualizado correctamente.",
    };
  } catch (err: any) {
    if (err.code === 'P2025') {
      return {
        success: false,
        message: "No se encontró el producto con el ID proporcionado."
      }
    }
    console.error("Error al actualizar el producto:", err);
    return {
      error: "Al actualizar el producto",
      message: "Ocurrió un error al actualizar el producto."
    }
  }
}
