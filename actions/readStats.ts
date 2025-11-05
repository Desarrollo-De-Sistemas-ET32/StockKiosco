'use server'

import db from '@/lib/db'

export async function getEstadisticasVentas() {
  try {
    const ingresosTotales = await db.ventas.aggregate({
      _sum: { total: true },
    })

    const ventasTotales = await db.ventas.count()

    const productosVendidos = await db.detalles_venta.aggregate({
      _sum: { cantidad: true },
    })

    return {
      ok: true,
      data: {
        ingresosTotales: ingresosTotales._sum.total ?? 0,
        ventasTotales,
        productosVendidos: productosVendidos._sum.cantidad ?? 0,
      },
    }
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return {
      ok: false,
      error: 'No se pudieron obtener las estadísticas',
    }
  }
}
