// app/api/productos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))

    const nombre = (body.nombre || '').toString().trim()
    const images = (body.images || '').toString().trim()
    const id_proveedor = Number(body.id_proveedor) || 1  // Ajusta según tu lógica
    const precio = Number(body.precio) || 0

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre del producto es requerido' }, { status: 400 })
    }

    // Crear nuevo producto
    const nuevoProducto = await prisma.productos.create({
      data: {
        nombre,
        images: images || null,
        id_proveedor,
        precio,
        fecha_actualizacion: new Date(),
      },
      select: {
        id_producto: true,
        nombre: true,
        images: true,
        precio: true,
      },
    })

    return NextResponse.json({
      message: 'Producto creado exitosamente',
      producto: nuevoProducto,
    })
  } catch (error: any) {
    console.error('Error en POST /api/productos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const productos = await prisma.productos.findMany({
      orderBy: { id_producto: 'desc' },
      select: {
        id_producto: true,
        nombre: true,
        images: true,
        precio: true,
      },
    })

    return NextResponse.json({ productos })
  } catch (error: any) {
    console.error('Error en GET /api/productos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
