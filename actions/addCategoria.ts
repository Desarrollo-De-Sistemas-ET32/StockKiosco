"use server";
import db from "@/lib/db";
import { z } from "zod";

import { createCategoriaSchema } from "@/schemas/categoria_scheme";
import { serializePrismaObject } from "@/lib/utils";

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

    return { categoria: serializePrismaObject(categoria) };

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