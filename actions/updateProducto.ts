"use server";
import db from "@/lib/db";
import { updateProductSchema } from "@/schemas/producto_scheme";
import { serializePrismaObject } from "@/lib/utils";
import { z } from "zod";

export const updateProduct = async (values: unknown) => {
  try {
    const validatedData = updateProductSchema.parse(values);
    const { id_producto, stock, id_categoria, stock_minimo, ...productData } =
      validatedData;

    const updateData: any = { ...productData };

    if (updateData.codigo_barra) {
      updateData.codigo_barra = BigInt(updateData.codigo_barra);
    }

    updateData.fecha_actualizacion = new Date();

    if (id_categoria) {
      const categoriaRecord = await db.categorias.findUnique({
        where: { id_categoria },
      });
      if (!categoriaRecord) {
        return {
          success: false,
          message: `La categoría con ID ${id_categoria} no existe`,
        };
      }
      updateData.id_categoria = id_categoria;
    }

    const stockUpdatePayload: any = {};
    if (stock !== undefined) {
      stockUpdatePayload.cantidad = stock;
    }

    if (stock_minimo !== undefined) {
      stockUpdatePayload.cantidad_min = stock_minimo;
    }

    if (Object.keys(stockUpdatePayload).length > 0) {
      updateData.stock = {
        upsert: {
          where: { id_producto },
          update: stockUpdatePayload,
          create: stockUpdatePayload,
        },
      };
    }

    const result = await db.$transaction(async (tx) => {
      const updatedProduct = await tx.productos.update({
        where: { id_producto },
        data: updateData,
        include: {
          stock: true,
          marcas: true,
          categoria: true,
        },
      });

      const totalStock = await tx.stock.aggregate({
        where: { id_producto },
        _sum: { cantidad: true },
      });

      const cantidadTotal = totalStock._sum.cantidad ?? 0;
      const habilitado = cantidadTotal > 0;

      if (updatedProduct.habilitado !== habilitado) {
        await tx.productos.update({
          where: { id_producto },
          data: { habilitado },
        });
      }

      const finalProduct = await tx.productos.findUnique({
        where: { id_producto },
        include: {
          stock: true,
          marcas: true,
          categoria: true,
        },
      });

      return finalProduct;
    });

    return {
      success: true,
      message: "Producto actualizado correctamente",
      product: serializePrismaObject(result),
    };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        message: "Error de validación en los datos enviados",
        errors: err.errors.map((e) => ({
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

    console.error("Error en updateProduct:", err);
    return {
      success: false,
      message: "Error interno del servidor",
    };
  }
};
