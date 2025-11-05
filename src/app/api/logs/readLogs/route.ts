
import { NextResponse } from 'next/server'
import { readLogs } from '@/actions/readLogs'

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': FRONTEND_ORIGIN,
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}


export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}


export async function GET() {
  try {
    const { logs, error } = await readLogs()
    if (error) throw new Error(error)

    return NextResponse.json(logs, { status: 200, headers: CORS_HEADERS })
  } catch (error) {
    console.error('Error al obtener logs:', error)
    return NextResponse.json(
      { error: 'Error al obtener los registros' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
