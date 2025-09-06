"use server";
import db from "@/lib/db";
import { createProductSchema } from "@/schemas/producto_scheme";
import { z } from "zod";

function normalizeProduct(obj: any): any {
  if (typeof obj === "bigint") return obj.toString();
  if (obj && obj.constructor?.name === "Decimal") return Number(obj.toString());
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(normalizeProduct);
  if (obj && typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, normalizeProduct(v)])
    );
  return obj;
}

type CreateProductValues = z.infer<typeof createProductSchema>;

export const createProduct = async (values: CreateProductValues) => {
  try {
    const validatedData = createProductSchema.parse(values);

    const categoriaRecord = await db.categorias.findFirst({
      where: {
        nombre: { equals: validatedData.categoria.toLowerCase(), mode: "insensitive" },
      },
    });

    if (!categoriaRecord) {
      return { error: { categoria: `La categoría "${validatedData.categoria}" no existe` } };
    }

    const product = await db.productos.create({
      data: {
        nombre: validatedData.nombre,
        precio: validatedData.precio,
        codigo_barra: validatedData.codigo_barra,
        fecha_actualizacion: validatedData.fecha_actualizacion,
        id_proveedor: validatedData.id_proveedor,
        id_marca: validatedData.id_marca ?? null,
        id_categoria: categoriaRecord.id_categoria,
        images: validatedData.images,
        stock: {
          create: [
            {
              cantidad: validatedData.stock,
              fecha_actualizacion: validatedData.fecha_actualizacion,
            },
          ],
        },
      },
    });

    return { product: normalizeProduct(product) };

  } catch (error) {
    if (error instanceof z.ZodError) {

      const formattedErrors = error.errors.reduce((acc, curr) => {
        const key = curr.path[0] as string;
        acc[key] = curr.message;
        return acc;
      }, {} as Record<string, string>);

      return { error: formattedErrors };
    }

    console.error("Error creating product:", error);
    return { error: { general: (error as Error).message } };
  }
};
