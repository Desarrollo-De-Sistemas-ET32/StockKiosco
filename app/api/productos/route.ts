// app/api/productos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente del lado del servidor con la service_role key
const supabaseServer = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))

    const nombre = (body.nombre || '').toString().trim()
    const images = body.images || null

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre del producto es requerido' }, { status: 400 })
    }

    const insertPayload = { nombre, images }

    const { data, error } = await supabaseServer
      .from('productos')
      .insert([insertPayload])
      .select('id, nombre, images')
      .single()

    if (error) {
      console.error('Error al insertar producto:', error)
      return NextResponse.json({ error: 'Error al crear producto: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Producto creado exitosamente',
      producto: data
    })
  } catch (error: any) {
    console.error('Error en API productos:', error)
    return NextResponse.json({ error: 'Error interno del servidor: ' + error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('productos')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Error al obtener productos:', error)
      return NextResponse.json({ error: 'Error al obtener productos: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({
      productos: data || []
    })
  } catch (error: any) {
    console.error('Error en API productos GET:', error)
    return NextResponse.json({ error: 'Error interno del servidor: ' + error.message }, { status: 500 })
  }
}
