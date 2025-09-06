'use server'
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { updateProductSchema } from "@/schemes/producto_scheme";

export const updateProduct = async (values: unknown) => {
  try {
    const validatedData = updateProductSchema.parse(values);

    const updatedProduct = await db.productos.update({
      where: { id_producto: validatedData.id_producto },
      data: {
        nombre: validatedData.nombre,
        id_marca: validatedData.id_marca ?? null,
        id_proveedor: validatedData.id_proveedor,
        codigo_barra:
          typeof validatedData.codigo_barra === "string"
            ? BigInt(validatedData.codigo_barra)
            : validatedData.codigo_barra,
        precio: new Prisma.Decimal(validatedData.precio),
        fecha_actualizacion: new Date(),
      },
    });

    return {
      success: true,
      message: "Producto actualizado correctamente",
      product: updatedProduct,
    };
  } catch (err: any) {
    if (err instanceof Error && "errors" in err) {
      return {
        success: false,
        message: "Error de validación",
        errors: err.errors,
      };
    }

    if (err.code === 'P2025') {
      return {
        success: false,
        message: "No se encontró el producto con el ID proporcionado",
      };
    }

    console.error("Error al actualizar el producto:", err);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el producto",
    };
  }
};
