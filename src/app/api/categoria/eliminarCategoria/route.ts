
import { NextResponse } from "next/server";
import { deleteCategoria } from "@/actions/deleteCategoria";
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

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en DELETE /categoria/eliminarCategoria:", body);

    const result = await deleteCategoria(body);

    if (!result.success) {
      const status = result.message?.includes("No se encontró") ? 404 : 400;
      return NextResponse.json(
        { error: result.message, details: result.errors ?? undefined },
        { status, headers: CORS_HEADERS }
      );
    }


    await db.logs.create({
      data: {
        id_usuario: body.id_usuario || null,
        accion: "Eliminación de categoría",
        descripcion: `Se eliminó la categoría con ID ${
          result.categoria?.id_categoria ?? "desconocido"
        } y nombre "${result.categoria?.nombre ?? "sin nombre"}" por el usuario ${
          body.id_usuario || "desconocido"
        }.`,
      },
    });

    console.log(
      "Categoría eliminada exitosamente:",
      JSON.stringify(result, null, 2)
    );

    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("Error en DELETE /api/categoria/eliminarCategoria:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
