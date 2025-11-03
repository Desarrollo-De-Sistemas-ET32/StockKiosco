// src/app/api/ventas/ventaRealizada/route.ts
import { addVenta, NuevaVenta } from "@/actions/ventaAction";
import { NextResponse } from "next/server";
import db from "@/lib/db";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// Preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// GET → Obtener todas las ventas
export async function GET() {
  try {
    const ventas = await db.ventas.findMany({
      include: { detalles_venta: true },
      orderBy: { fecha_creacion: "desc" },
    });
    return NextResponse.json(ventas, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("Error GET /ventas:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: CORS_HEADERS });
  }
}

// POST → Crear venta
export async function POST(req: Request) {
  try {
    const body: NuevaVenta = await req.json();
    const result = await addVenta(body);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400, headers: CORS_HEADERS });
    }

    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("Error POST /ventas:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500, headers: CORS_HEADERS });
  }
}
