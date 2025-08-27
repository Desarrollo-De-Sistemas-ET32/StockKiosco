// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/)
  if (!match) throw new Error('Invalid data URL')
  const contentType = match[1]
  const base64 = match[2]
  const buffer = Buffer.from(base64, 'base64')
  return { buffer, contentType }
}

export async function POST(req: NextRequest) {
  try {
    // Si faltan variables de entorno, respondemos con JSON y no hacemos throw en import-time
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing supabase env variables', {
        NEXT_PUBLIC_SUPABASE_URL: Boolean(SUPABASE_URL),
        SUPABASE_SERVICE_ROLE_KEY: Boolean(SUPABASE_SERVICE_ROLE_KEY)
      })
      return NextResponse.json(
        { error: 'Missing supabase env variables on server. Revisa .env.local y reinicia el servidor.' },
        { status: 500 }
      )
    }

    // Creamos el cliente DENTRO de la función para evitar problemas en import-time
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    })

    const body = await req.json().catch(() => null)
    const { dataUrl, fileName, productoId } = body || {}

    if (!dataUrl || !fileName) {
      return NextResponse.json({ error: 'Missing dataUrl or fileName' }, { status: 400 })
    }

    // parseamos data URL
    const { buffer, contentType } = parseDataUrl(dataUrl)

    const timestamp = Date.now()
    const ext = fileName.split('.').pop() || 'jpg'
    const uniqueFileName = `producto_${timestamp}.${ext}`
    const pathInBucket = `productos/${uniqueFileName}`

    // SUBIR al bucket 'productos'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('productos')
      .upload(pathInBucket, buffer, {
        contentType,
        upsert: false
      })

    if (uploadError) {
      console.error('uploadError', uploadError)
      return NextResponse.json({ error: uploadError.message || 'Upload error' }, { status: 500 })
    }

    // OBTENER PUBLIC URL del MISMO bucket
    const { data: urlData, error: urlError } = supabase.storage
      .from('productos')
      .getPublicUrl(pathInBucket)

    if (urlError) {
      console.error('urlError', urlError)
      return NextResponse.json({ error: urlError.message || 'Public URL error' }, { status: 500 })
    }

    const publicUrl = (urlData as any).publicUrl

    // SI VIENE productoId -> actualizar fila en tabla 'productos'
    if (productoId) {
      const { error: updateError } = await supabase
        .from('productos')
        .update({ images: publicUrl })
        .eq('id', productoId)

      if (updateError) {
        console.error('updateError', updateError)
        return NextResponse.json({ error: updateError.message || 'DB update error' }, { status: 500 })
      }
    }

    return NextResponse.json({ publicUrl })
  } catch (err: any) {
    console.error('Server upload error', err)
    return NextResponse.json({ error: err?.message || 'Unknown server error' }, { status: 500 })
  }
}
