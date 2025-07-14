'use server'
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

type filtrado = {
    id_proveedor: number;
    nombre: string;
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
    fecha_actualizacion: Date;
}


export const updateProveedor = async(values: { id_proveedor: number, data: filtrado }) => {
  try {
    const { id_proveedor, data } = values;

    if (typeof id_proveedor !== "number" || isNaN(id_proveedor)) {
      return { 
        success: false, 
        message: "El ID del producto debe ser un número válido." 
      };
    }

    await db.proveedores.update({
        where: { id_proveedor: values.id_proveedor },
        data: {
            nombre: values.data.nombre,
            contacto: values.data.contacto,
            telefono: values.data.telefono,
            email: values.data.email,
            direccion: values.data.direccion,
            fecha_actualizacion: new Date(),
  }
});

    return {
      success: true,
      message: "Proveedor actualizado correctamente.",
    };
  } catch (err: any) {
    if (err.code === 'P2025') {
      return {
        success: false,
        message: "No se encontró el proveedor con el ID proporcionado."
      }
    }
    console.error("Error al actualizar el proveedor:", err);
    return {
      error: "Al actualizar el proveedor",
      message: "Ocurrió un error al actualizar el proveedor."
    }
  }
}