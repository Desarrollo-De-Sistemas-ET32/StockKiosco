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

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const ventas = await db.ventas.findMany({
      include: { detalles_venta: true },
      orderBy: { fecha_creacion: "desc" },
    });

    return NextResponse.json(ventas, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("Error GET /ventas:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;


    const id_usuario_admin =
      body.id_usuario_admin ??
      body.idUsuarioAdmin ??
      body.adminId ??
      null;

    const result = await addVenta(body as NuevaVenta);

    if (!result || !result.success) {
      return NextResponse.json(
        { error: result?.message ?? "No se pudo crear la venta" },
        { status: 400, headers: CORS_HEADERS }
      );
    }


    const ventaId = result.venta?.id_venta ?? null;

    const descripcion =
      ventaId !== null
        ? `La venta #${ventaId} fue creada correctamente.`
        : `La venta fue creada correctamente.`;


    try {
      await db.logs.create({
        data: {
          id_usuario: id_usuario_admin,
          accion: "Creación de venta",
          descripcion,
        },
      });

    } catch (logErr) {
      console.warn("No se pudo crear el log de venta:", logErr);
    }

    return NextResponse.json(result, {
      status: 200,
      headers: CORS_HEADERS,
    });

  } catch (err) {
    console.error("Error POST /ventas:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
