// src/app/api/categoria/eliminarCategoria/route.ts
import { NextResponse } from 'next/server'
import { deleteCategoria } from '@/actions/deleteCategoria'

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const result = await deleteCategoria(body)

    if (!result.success) {
      const status = result.message?.includes('No se encontró') ? 404 : 400
      return NextResponse.json(
        { error: result.message, details: result.errors ?? undefined },
        { status }
      )
    }

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
