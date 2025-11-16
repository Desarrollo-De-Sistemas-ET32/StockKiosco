'use server'

import db from '@/lib/db'
import { z } from 'zod'
import { readCategoriaSchema } from '@/schemas/categoria_scheme' 
import { serializePrismaObject } from '@/lib/utils'

type ReadCategoriaParams = z.infer<typeof readCategoriaSchema>

export const readCategoria = async (params?: ReadCategoriaParams) => {
  try {
    // Validar parámetros opcionales
    const validatedParams = params ? readCategoriaSchema.parse(params) : {}

    const whereClause: any = {}

    if (validatedParams.id_categoria) {
      whereClause.id_categoria = validatedParams.id_categoria
    }

    if (validatedParams.nombre) {
      whereClause.nombre = { contains: validatedParams.nombre, mode: 'insensitive' }
    }

    const categorias = await db.categorias.findMany({
      where: whereClause,
      orderBy: { id_categoria: 'asc' },
    })

    return { categorias: serializePrismaObject(categorias) }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        const key = curr.path[0] as string
        acc[key] = curr.message
        return acc
      }, {} as Record<string, string>)
      return { error: formattedErrors }
    }

    console.error('Error leyendo categorías:', error)
    return { error: error?.message ?? 'Error desconocido al leer categorías' }
  }
}
