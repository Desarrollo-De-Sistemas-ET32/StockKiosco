// src/actions/updateCategoria.ts
'use server'
import db from "@/lib/db"
import { updateCategoriaSchema } from "@/schemas/categoria_scheme"
import { z } from "zod"

function bigintToString(obj: any): any {
  if (typeof obj === "bigint") return obj.toString()
  if (Array.isArray(obj)) return obj.map(bigintToString)
  if (obj && typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, bigintToString(v)])
    )
  return obj
}

interface ResultadoUpdateCategoria {
  success: boolean
  message: string
  categoria?: any
  errors?: Array<{ field: string; message: string }>
}

export const updateCategoria = async (values: unknown): Promise<ResultadoUpdateCategoria> => {
  try {
    const validatedData = updateCategoriaSchema.parse(values)

    const categoriaExistente = await db.categorias.findUnique({
      where: { id_categoria: validatedData.id_categoria },
    })

    if (!categoriaExistente) {
      return {
        success: false,
        message: "No se encontró la categoría con el ID proporcionado",
      }
    }

    if (categoriaExistente.nombre === validatedData.nombre) {
      return {
        success: true,
        message: "Sin cambios en la categoría",
        categoria: bigintToString(categoriaExistente),
      }
    }

    const nombreExiste = await db.categorias.findFirst({
      where: {
        nombre: validatedData.nombre,
        id_categoria: { not: validatedData.id_categoria },
      },
    })

    if (nombreExiste) {
      return {
        success: false,
        message: "Ya existe otra categoría con ese nombre",
      }
    }

    const categoriaActualizada = await db.categorias.update({
      where: { id_categoria: validatedData.id_categoria },
      data: { nombre: validatedData.nombre },
    })

    return {
      success: true,
      message: "Categoría actualizada correctamente",
      categoria: bigintToString(categoriaActualizada),
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        message: "Error de validación en los datos enviados",
        errors: err.errors.map((e) => ({
          field: e.path.join(".") || "nombre",
          message: e.message,
        })),
      }
    }

    if (err?.code === "P2025") {
      return {
        success: false,
        message: "No se encontró la categoría con el ID proporcionado",
      }
    }

    if (err?.code === "P2002") {
      return {
        success: false,
        message: "Ya existe una categoría con ese nombre",
      }
    }

    console.error("Error al actualizar la categoría:", err)
    return {
      success: false,
      message: "Ocurrió un error interno al actualizar la categoría",
    }
  }
}
