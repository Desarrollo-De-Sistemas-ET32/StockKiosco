// src/actions/readProducto.ts
'use server'

import db from '@/lib/db'
import { serializePrismaObject } from '@/lib/utils'

export const readProductos = async () => {
  try {
    const products = await db.productos.findMany({
      include: {
        marcas: true,
        proveedores: true,
        categoria: true,
        stock: true,
      },
      orderBy: { id_producto: 'asc' },
    })

    const normalized = serializePrismaObject(products)
    console.log
    return { products: normalized }
  } catch (error: any) {
    console.error('Error leyendo productos:', error)
    return { error: (error as Error).message ?? 'Error desconocido al leer productos' }
  }
}
