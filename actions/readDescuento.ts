'use server'

import db from '@/lib/db'
import { serializePrismaObject } from '@/lib/utils'

export const readLogs = async () => {
  try {
    const logs = await db.logs.findMany({
      include: {
        usuarios: {
          select: {
            id_usuario: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { fecha_creacion: 'desc' },
    })

    return { logs: serializePrismaObject(logs) }
  } catch (error: any) {
    console.error('Error leyendo logs:', error)
    return { error: error?.message ?? 'Error desconocido al leer logs' }
  }
}
