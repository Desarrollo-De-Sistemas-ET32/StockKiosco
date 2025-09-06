'use server'
import db from "../src/lib/db";
import { crearProveedorSchema } from "@/schemes/proveedor_scheme";
import { z } from "zod";

export const agregarProveedor = async (values: z.infer<typeof crearProveedorSchema>) => {
  const parsed = crearProveedorSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: "Datos inválidos",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const nuevoProveedor = await db.proveedores.create({
      data: {
        nombre: data.nombre,
        contacto: data.contacto,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
        fecha_actualizacion: new Date(), // Se setea la fecha actual al crear
      },
    });

    return {
      success: true,
      message: "Proveedor agregado correctamente.",
      proveedor: nuevoProveedor,
    };
  } catch (err) {
    console.error("Error al agregar proveedor:", err);
    return {
      error: "Error al agregar proveedor",
      message: "Ocurrió un error al agregar el proveedor.",
    };
  }
};