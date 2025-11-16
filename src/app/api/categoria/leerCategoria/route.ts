// app/api/categorias/leerCategoria/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCategoria } from "@/actions/addCategoria";
import { readCategoria } from "@/actions/readCategoria";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': FRONTEND_ORIGIN, 
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};


export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createCategoria(body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        message: "Categoría creada exitosamente",
        categoria: result.categoria
      },
      { status: 201, headers: CORS_HEADERS }
    );

  } catch (error) {
    console.error("Error in POST /api/categorias/leerCategoria:", error);
    return NextResponse.json(
      { error: { general: "Error interno del servidor" } },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET() {
  try {
    const result = await readCategoria();

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500, headers: CORS_HEADERS }
      );
    }


    return NextResponse.json(
      {
        categorias: result.categorias
      },
      { status: 200, headers: CORS_HEADERS }
    );

  } catch (error) {
    console.error("Error in GET /api/categorias/leerCategoria:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
