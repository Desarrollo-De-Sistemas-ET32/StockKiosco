'use server'
import db from "../src/lib/db";
import { actualizarProveedorSchema } from "@/schemas/proveedor_scheme";

export const updateProveedor = async (data: any) => {
  try {
    // Validar los datos de entrada
    const parsedData = actualizarProveedorSchema.parse(data);
    console.log("Datos validados:", parsedData);

    const { id_proveedor, nombre, direccion, telefono, email } = parsedData;

    // Actualizar el proveedor en la base de datos
    const updatedProveedor = await db.proveedores.update({
      where: { id_proveedor },
      data: {
        nombre,
        direccion,
        telefono,
        email,
        fecha_actualizacion: new Date(),
      },
    });
    console.log("Proveedor actualizado:", updatedProveedor);
    return { success: true, proveedor: updatedProveedor };
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    return { success: false, error: "Error al actualizar el proveedor" };
  }
};