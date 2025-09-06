'use server';
import db from "../src/lib/db";
import { delproveedorSchema } from "@/schemes/proveedor_scheme";
import { z } from "zod"; 


export const deleteProveedor = async (values: z.infer<typeof delproveedorSchema>) => {
  const parsed = delproveedorSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: "Datos inválidos",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const { name } = parsed.data;

  try {
    const proveedor = await db.proveedores.findFirst({
      where: { nombre: name },
    });

    if (!proveedor) {
      return { error: "Proveedor no encontrado" };
    }

    await db.proveedores.delete({
      where: { id_proveedor: proveedor.id_proveedor },
    });

    return {
      success: true,
      message: `Proveedor con nombre ${name} eliminado exitosamente.`,
    };
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    return { error: "Error al eliminar proveedor" };
  }
};
