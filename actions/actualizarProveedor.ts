'use server'
import db from "../src/lib/db";
import { actualizarProveedorSchema } from "@/app/schemes/proveedorScheme";
import { z } from "zod"; 

export const updateProveedor = async (values: z.infer<typeof actualizarProveedorSchema>) => {
  const parsed = actualizarProveedorSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: "Datos inválidos",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await db.proveedores.update({
      where: { id_proveedor: data.id_proveedor },
      data: {
        nombre: data.nombre,
        contacto: data.contacto,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
        fecha_actualizacion: data.fecha_actualizacion ?? new Date(),
      },
    });

    return {
      success: true,
      message: "Proveedor actualizado correctamente.",
    };
  } catch (err: any) {
    if (err.code === 'P2025') {
      return {
        success: false,
        message: "No se encontró el proveedor con el ID proporcionado.",
      };
    }

    console.error("Error al actualizar el proveedor:", err);
    return {
      error: "Al actualizar el proveedor",
      message: "Ocurrió un error al actualizar el proveedor.",
    };
  }
};
