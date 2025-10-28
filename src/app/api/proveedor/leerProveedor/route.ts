// src/app/api/proveedor/leerProveedor/route.ts
import { NextResponse } from "next/server";
import { readProveedor } from "@/actions/readProveedor";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// Manejar preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  try {
    const result = await readProveedor();

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { proveedores: result.proveedores },
      { status: 200, headers: CORS_HEADERS }
    );

  } catch (error) {
    console.error("Error in GET /api/proveedores:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
