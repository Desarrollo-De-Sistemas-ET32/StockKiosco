// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs' // importante para usar Buffer

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('Missing supabase env variables', {
        SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
        SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      })
      return NextResponse.json(
        { error: 'Missing supabase env variables on server. Revisa .env.local y reinicia el servidor.' },
        { status: 500 }
      )
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('WARNING: usando NEXT_PUBLIC_SUPABASE_ANON_KEY como fallback (solo para DEV). No usar en producción.')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    })

    const body = await req.json().catch(() => null)
    const { dataUrl, fileName, productoId } = body || {}

    if (!dataUrl || !fileName) {
      return NextResponse.json({ error: 'Missing dataUrl or fileName' }, { status: 400 })
    }

    const { buffer, contentType } = parseDataUrl(dataUrl)
    const timestamp = Date.now()
    const ext = (fileName.split('.').pop() || 'jpg').replace(/\?.*$/, '')
    const uniqueFileName = `producto_${timestamp}.${ext}`
    const pathInBucket = `productos/${uniqueFileName}`

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

    const { data: urlData } = supabase.storage
      .from('productos')
      .getPublicUrl(pathInBucket)

    const publicUrl = (urlData as any)?.publicUrl
    if (!publicUrl) {
      return NextResponse.json({ error: 'No public URL returned. Revisa permisos del bucket.' }, { status: 500 })
    }

    // si llega productoId, actualizamos la columna `images` en la tabla `productos`
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
