// src/actions/deleteCategoria.ts
'use server'
import { z } from 'zod'
import db from '@/lib/db'
import { deleteCategoriaSchema } from '@/schemas/categoria_scheme'

function bigintToString(obj: any): any {
  if (typeof obj === 'bigint') return obj.toString()
  if (Array.isArray(obj)) return obj.map(bigintToString)
  if (obj && typeof obj === 'object')
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, bigintToString(v)])
    )
  return obj
}

interface ResultadoDeleteCategoria {
  success: boolean
  message: string
  categoria?: any
  errors?: Array<{ field: string; message: string }>
}

export const deleteCategoria = async (values: unknown): Promise<ResultadoDeleteCategoria> => {
  try {
    const { id_categoria } = deleteCategoriaSchema.parse(values)

    const categoriaExistente = await db.categorias.findUnique({
      where: { id_categoria },
    })

    if (!categoriaExistente) {
      return {
        success: false,
        message: 'No se encontró la categoría con el ID proporcionado',
      }
    }

    const categoriaEliminada = await db.categorias.delete({
      where: { id_categoria },
    })

    return {
      success: true,
      message: 'Categoría eliminada correctamente',
      categoria: bigintToString(categoriaEliminada),
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        message: 'Error de validación en los datos enviados',
        errors: err.errors.map((e) => ({
          field: e.path.join('.') || 'id_categoria',
          message: e.message,
        })),
      }
    }

    if (err?.code === 'P2025') {
      return {
        success: false,
        message: 'No se encontró la categoría con el ID proporcionado',
      }
    }

    console.error('Error al eliminar la categoría:', err)
    return {
      success: false,
      message: 'Ocurrió un error interno al eliminar la categoría',
    }
  }
}
