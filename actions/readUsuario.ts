// src/actions/readUsuarios.ts
'use server'

import db from '@/lib/db'
import { serializePrismaObject } from '@/lib/utils'

export const readUsuarios = async () => {
  try {
    const usuarios = await db.usuarios.findMany({
      orderBy: { id_usuario: 'asc' },
      select: {
        id_usuario: true,
        name: true,
        email: true,
        usuarios_roles: true
      }
    })

    return { usuarios: serializePrismaObject(usuarios) }
  } catch (error: any) {
    console.error('Error leyendo usuarios:', error)
    return { error: error?.message ?? 'Error desconocido al leer usuarios' }
  }
}