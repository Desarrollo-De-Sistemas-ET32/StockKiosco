//actions/addcategoria.ts
"use server";
import db from "@/lib/db";
import { z } from "zod";

import { createCategoriaSchema } from "@/schemas/categoria_scheme";

function normalizeCategoria(obj: any): any {
  if (typeof obj === "bigint") return obj.toString();
  if (obj && obj.constructor?.name === "Decimal") return Number(obj.toString());
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(normalizeCategoria);
  if (obj && typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, normalizeCategoria(v)])
    );
  return obj;
}

type CreateCategoriaValues = z.infer<typeof createCategoriaSchema>;

export const createCategoria = async (values: CreateCategoriaValues) => {
  try {
    const validatedData = createCategoriaSchema.parse(values);

    // Verificar si la categoría ya existe
    const existingCategoria = await db.categorias.findFirst({
      where: {
        nombre: { equals: validatedData.nombre, mode: "insensitive" },
      },
    });

    if (existingCategoria) {
      return { error: { nombre: `La categoría "${validatedData.nombre}" ya existe` } };
    }

    const categoria = await db.categorias.create({
      data: {
        nombre: validatedData.nombre,
      },
    });

    return { categoria: normalizeCategoria(categoria) };

  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        const key = curr.path[0] as string;
        acc[key] = curr.message;
        return acc;
      }, {} as Record<string, string>);

      return { error: formattedErrors };
    }

    console.error("Error creating categoria:", error);
    return { error: { general: (error as Error).message } };
  }
};