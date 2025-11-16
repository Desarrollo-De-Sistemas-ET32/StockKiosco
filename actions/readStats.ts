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

   
    const hoy = new Date()
    const hace7dias = new Date()
    hace7dias.setDate(hoy.getDate() - 6)


    const ingresosSemanalesRaw = await db.ventas.groupBy({
      by: ['fecha_venta'],
      _sum: { total: true },
      where: {
        fecha_venta: {
          gte: hace7dias,
          lte: hoy,
        },
      },
      orderBy: {
        fecha_venta: 'asc',
      },
    })

    const ingresosSemanales = ingresosSemanalesRaw.map((i) => ({
      fecha: i.fecha_venta.toISOString().split('T')[0],
      total: Number(i._sum.total ?? 0),
    }))


    const productosVendidosRaw = await db.detalles_venta.groupBy({
      by: ["id_producto"],
      _sum: { cantidad: true },
      orderBy: {
        _sum: { cantidad: "desc" },
      },
    })

    const productosVendidosDetalle = await Promise.all(
      productosVendidosRaw.map(async (p) => {
        const producto = await db.productos.findUnique({
          where: { id_producto: p.id_producto },
          select: {
            id_producto: true,
            nombre: true,
            precio: true,
          },
        })

        return {
          id_producto: producto?.id_producto,
          nombre: producto?.nombre,
          precio: Number(producto?.precio ?? 0),
          cantidad_vendida: p._sum.cantidad ?? 0,
        }
      })
    )


    return {
      ok: true,
      data: {
        ingresosTotales: Number(ingresosTotales._sum.total ?? 0),
        ventasTotales,
        productosVendidos: Number(productosVendidos._sum.cantidad ?? 0),
        ingresosSemanales,
        productosVendidosDetalle,
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
