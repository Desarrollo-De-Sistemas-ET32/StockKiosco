'use server';
import db from "@/lib/db";
import { updateProductSchema } from "@/schemas/producto_scheme";
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

export const updateProduct = async (values: unknown) => {
  try {
    const validatedData = updateProductSchema.parse(values);

    const updateData: any = {};

    if (validatedData.nombre) updateData.nombre = validatedData.nombre;
    if (validatedData.precio) updateData.precio = validatedData.precio;
    if (validatedData.codigo_barra)
      updateData.codigo_barra =
        typeof validatedData.codigo_barra === "string"
          ? BigInt(validatedData.codigo_barra)
          : validatedData.codigo_barra;
    if (validatedData.id_proveedor !== undefined)
      updateData.id_proveedor = validatedData.id_proveedor;
    if (validatedData.id_marca !== undefined)
      updateData.id_marca = validatedData.id_marca;
    if (validatedData.images !== undefined)
      updateData.images = validatedData.images;
    if (validatedData.fecha_actualizacion)
      updateData.fecha_actualizacion = validatedData.fecha_actualizacion;
    else updateData.fecha_actualizacion = new Date();

    if (validatedData.categoria) {
      const categoriaRecord = await db.categorias.findUnique({
        where: { nombre: validatedData.categoria.toLowerCase() },
      });
      if (!categoriaRecord) {
        return { success: false, message: `La categoría "${validatedData.categoria}" no existe` };
      }
      updateData.id_categoria = categoriaRecord.id_categoria;
    }

    const product = await db.productos.update({
      where: { id_producto: validatedData.id_producto },
      data: updateData,
      include: {
        stock: true,
      },
    });

    // Actualización de stock automáticamente
    if (validatedData.stock !== undefined) {
      const stockRecord = await db.stock.findFirst({
        where: { id_producto: validatedData.id_producto },
      });

      if (stockRecord) {
        await db.stock.update({
          where: { id_stock: stockRecord.id_stock },
          data: {
            cantidad: validatedData.stock,
            fecha_actualizacion: new Date(),
          },
        });
      } else {
        await db.stock.create({
          data: {
            id_producto: validatedData.id_producto,
            cantidad: validatedData.stock,
            fecha_actualizacion: new Date(),
          },
        });
      }
    }

    const updatedProduct = await db.productos.findUnique({
      where: { id_producto: validatedData.id_producto },
      include: { stock: true },
    });

    return { success: true, message: "Producto actualizado correctamente", product: bigintToString(updatedProduct) };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        message: "Error de validación en los datos enviados",
        errors: err.errors.map(e => ({
          field: e.path.join("."),
          message: e.message,
        })),
      };
    }

    if (err.code === "P2025") {
      return {
        success: false,
        message: "No se encontró el producto con el ID proporcionado",
      };
    }

    console.error("Error al actualizar el producto:", err);
    return { success: false, message: "Ocurrió un error al actualizar el producto" };
  }
};
