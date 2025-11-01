'use server'

import db from '@/lib/db'
import { serializePrismaObject } from '@/lib/utils'
export const readMarcas = async () => {
  try {
    const marcas = await db.marcas.findMany({
      orderBy: { id_marca: 'asc' },
    })

    console.log('Marcas leídas:', marcas)
    return { marcas: serializePrismaObject(marcas) }
  } catch (error: any) {
    console.error('Error leyendo marcas:', error)
    return { error: (error as Error).message ?? 'Error desconocido al leer marcas' }
  }
}