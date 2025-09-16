
import { NextResponse } from 'next/server'
import { readDescuento } from '@/actions/readDescuento'

export async function GET() {
  try {
    const result = await readDescuento()
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('API error (leerDescuento):', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
