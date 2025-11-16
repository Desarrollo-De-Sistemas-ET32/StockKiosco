"use server";

import db from "@/lib/db";
import { z } from "zod";
import { createMarcaSchema } from "@/schemas/marca_scheme";
import { serialize } from "v8";
import { serializePrismaObject } from "@/lib/utils";

type createMarcaSchema = z.infer<typeof createMarcaSchema>;

export const addMarca = async (nombre: string) => {
  try {
    
    const validatedData = createMarcaSchema.parse({ nombre_marca: nombre });

 
    const existingMarca = await db.marcas.findFirst({
      where: {
        nombre_marca: { equals: validatedData.nombre, mode: "insensitive" },
      },
    });

    if (existingMarca) {
      return { error: { nombre_marca: `La marca "${nombre}" ya existe` } };
    }

    const marca = await db.marcas.create({
      data: {
        nombre_marca: nombre,
      },
    });

    return { marca: serializePrismaObject(marca) };

  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        const key = curr.path[0] as string;
        acc[key] = curr.message;
        return acc;
      }, {} as Record<string, string>);

      return { error: formattedErrors };
    }

    console.error("Error creating marca:", error);
    return { error: { general: (error as Error).message } };
  }
};
