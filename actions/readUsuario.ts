// src/actions/readUsuarios.ts
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

export const readUsuarios = async () => {
  try {
    const usuarios = await db.usuarios.findMany({
      orderBy: { id_usuario: 'asc' },
      select: {
        id_usuario: true,
        name: true,
        email: true,
      }
    })

    return { usuarios: normalize(usuarios) }
  } catch (error: any) {
    console.error('Error leyendo usuarios:', error)
    return { error: error?.message ?? 'Error desconocido al leer usuarios' }
  }
}