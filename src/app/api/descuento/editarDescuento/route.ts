import { NextResponse } from "next/server";
import db from "@/lib/db";
import { updateDescuento } from "@/actions/updateDescuento";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (!body.id_descuento || !body.id_usuario) {
      return NextResponse.json(
        { success: false, message: "Faltan campos obligatorios." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const result = await updateDescuento(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400, headers: CORS_HEADERS });
    }

 
    await db.logs.create({
      data: {
        id_usuario: body.id_usuario || null,
        accion: "Edición de descuento",
        descripcion: `El descuento "${result.data!.nombre}" fue actualizado (valor: ${result.data!.valor}, tipo: ${result.data!.tipo}) por el usuario ${body.id_usuario || "desconocido"}.`,
      },
    });

    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error en PATCH /api/descuentos:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}
