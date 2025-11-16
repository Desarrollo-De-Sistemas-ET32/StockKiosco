
'use server'

import db from '@/lib/db'
import { serializePrismaObject } from '@/lib/utils'

export const readProveedor = async () => {
  try {
    const proveedores = await db.proveedores.findMany({
      orderBy: { id_proveedor: 'asc' },
    })

    return { proveedores: serializePrismaObject(proveedores) }
  } catch (error: any) {
    console.error('Error leyendo proveedores:', error)
    return { error: error?.message ?? 'Error desconocido al leer proveedores' }
  }
}