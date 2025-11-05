// src/app/api/categoria/actualizarCategoria/route.ts
import { updateCategoria } from "@/actions/updateCategoria";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en PATCH /categoria/actualizarCategoria:", body);

    const result = await updateCategoria(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message, details: result.errors ?? undefined },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    await db.logs.create({
      data: {
        id_usuario: body.id_usuario || null,
        accion: "Actualización de categoría",
        descripcion: `Se actualizó la categoría con ID ${
          result.categoria?.id_categoria ?? "desconocido"
        } y nombre "${result.categoria?.nombre ?? "sin nombre"}" por el usuario ${
          body.id_usuario || "desconocido"
        }.`,
      },
    });

    console.log(
      "Categoría actualizada exitosamente:",
      JSON.stringify(result, null, 2)
    );

    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("Error en API (actualizarCategoria):", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
