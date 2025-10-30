// src/actions/deleteCategoria.ts
'use server'
import { z } from 'zod'
import db from '@/lib/db'
import { deleteCategoriaSchema } from '@/schemas/categoria_scheme'
import { serializePrismaObject } from '@/lib/utils'

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
      categoria: serializePrismaObject(categoriaEliminada),
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
