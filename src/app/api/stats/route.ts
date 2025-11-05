import { NextResponse } from "next/server"
import { getEstadisticasVentas } from "@/actions/readStats"

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function GET() {
  try {
    const result = await getEstadisticasVentas()

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS })
  } catch (err) {
    console.error("Error en API (/estadisticas):", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
