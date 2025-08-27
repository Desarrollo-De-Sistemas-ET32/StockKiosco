// app/api/productos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing supabase env variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Ajustá los campos segun tu tabla (aquí un ejemplo)
    const {
      nombre,
      codigoBarras,
      vencimiento,
      categoria,
      marca,
      precioCompra,
      precioPublico,
      images // url ya subida
    } = body || {}

    if (!nombre) {
      return NextResponse.json({ error: 'Falta nombre' }, { status: 400 })
    }

    const newRow: any = {
      nombre,
      codigo_barras: codigoBarras || null,
      vencimiento: vencimiento || null,
      categoria: categoria || null,
      marca: marca || null,
      precio_compra: precioCompra ? Number(precioCompra) : null,
      precio_publico: precioPublico ? Number(precioPublico) : null,
      images: images || null
    }

    const { data, error } = await supabase.from('productos').insert([newRow]).select().limit(1)

    if (error) {
      console.error('insert error', error)
      return NextResponse.json({ error: error.message || 'Insert error' }, { status: 500 })
    }

    return NextResponse.json({ producto: data?.[0] ?? null })
  } catch (err: any) {
    console.error('Server productos error', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}
