import { createDescuento } from "@/actions/addDescuento"
import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("Body recibido en API:", body)

    const result = await createDescuento(body)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    if (result.success) {
      await db.logs.create({
        data: {
          id_usuario: body.id_usuario || null,
          accion: "Registro de descuento",
          descripcion: `Se creó un nuevo descuento "${result.descuento.nombre}" con valor ${result.descuento.valor} (${result.descuento.tipo}) por el usuario ${body.id_usuario || "desconocido"}.`,
        },
      })

      console.log("Descuento registrado exitosamente:", result)
      return NextResponse.json(
        { message: "Descuento creado exitosamente", descuento: result.descuento },
        { status: 201, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS })
  } catch (err) {
    console.error("API error:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
