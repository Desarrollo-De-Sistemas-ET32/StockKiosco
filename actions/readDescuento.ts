// src/actions/readDescuento.ts
'use server'

import db from '@/lib/db'

function normalize(obj: any): any {
  if (typeof obj === 'bigint') return obj.toString()
  if (obj && obj.constructor?.name === 'Decimal') return Number(obj.toString())
  if (obj instanceof Date) return obj.toISOString()
  if (Array.isArray(obj)) return obj.map(normalize)
  if (obj && typeof obj === 'object')
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, normalize(v)])
    )
  return obj
}

export const readDescuento = async () => {
  try {
    const descuentos = await db.descuentos.findMany({
      orderBy: { id_descuento: 'asc' },
    })

    return { descuentos: normalize(descuentos) }
  } catch (error: any) {
    console.error('Error leyendo descuentos:', error)
    return { error: error?.message ?? 'Error desconocido al leer descuentos' }
  }
}
