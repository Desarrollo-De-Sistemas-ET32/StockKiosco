// src/actions/readProducto.ts
'use server'

import db from '@/lib/db'

function normalizeProduct(obj: any): any {
  if (typeof obj === 'bigint') return obj.toString()
  if (obj && obj.constructor?.name === 'Decimal') return Number(obj.toString())
  if (obj instanceof Date) return obj.toISOString()
  if (Array.isArray(obj)) return obj.map(normalizeProduct)
  if (obj && typeof obj === 'object')
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, normalizeProduct(v)])
    )
  return obj
}

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

    const normalized = normalizeProduct(products)
    return { products: normalized }
  } catch (error: any) {
    console.error('Error leyendo productos:', error)
    return { error: (error as Error).message ?? 'Error desconocido al leer productos' }
  }
}
