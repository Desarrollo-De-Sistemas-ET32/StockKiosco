import { deleteProduct } from "@/actions/deleteProducto";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en DELETE /producto/eliminarProducto:", body);

    const result = await deleteProduct(body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    await db.logs.create({
      data: {
        id_usuario: body.id_usuario || null,
        accion: "Eliminación de producto",
        descripcion: `Se eliminó el producto con ID ${body.id_producto} por el usuario ${body.id_usuario || "desconocido"}.`,
      },
    });

    console.log("Producto eliminado exitosamente:", result);
    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("Error en API (eliminarProducto):", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
