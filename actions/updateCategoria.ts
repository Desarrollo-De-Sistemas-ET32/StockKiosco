// src/actions/updateCategoria.ts
'use server';
import db from "@/lib/db";
import { z } from "zod";

function bigintToString(obj: any): any {
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(bigintToString);
  if (obj && typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, bigintToString(v)])
    );
  return obj;
}

const updateCategoriaSchema = z.object({
  id_producto: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int()),
  id_categoria: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int()),
});

export const updateCategoria = async (values: unknown) => {
  try {
    const validatedData = updateCategoriaSchema.parse(values);

    const producto = await db.productos.findUnique({
      where: { id_producto: validatedData.id_producto },
    });

    if (!producto) {
      return { success: false, message: "No se encontró el producto con el ID proporcionado" };
    }

    const categoria = await db.categorias.findUnique({
      where: { id_categoria: validatedData.id_categoria },
    });

    if (!categoria) {
      return { success: false, message: "No se encontró la categoría con el ID proporcionado" };
    }

    if (producto.id_categoria === validatedData.id_categoria) {
      const prod = await db.productos.findUnique({
        where: { id_producto: validatedData.id_producto },
        include: { categoria: true, stock: true },
      });
      return { success: true, message: "Sin cambios (misma categoría)", product: bigintToString(prod) };
    }

    const actualizado = await db.productos.update({
      where: { id_producto: validatedData.id_producto },
      data: {
        id_categoria: validatedData.id_categoria,
        fecha_actualizacion: new Date(),
      },
      include: { categoria: true, stock: true },
    });

    return { success: true, message: "Categoría actualizada correctamente", product: bigintToString(actualizado) };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        message: "Error de validación en los datos enviados",
        errors: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
      };
    }

    if (err?.code === "P2025") {
      return { success: false, message: "No se encontró el producto con el ID proporcionado" };
    }

    console.error("Error al actualizar la categoría:", err);
    return { success: false, message: "Ocurrió un error al actualizar la categoría" };
  }
};
