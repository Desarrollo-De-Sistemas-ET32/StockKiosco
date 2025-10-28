// src/app/api/categoria/actualizarCategoria/route.ts
import { updateCategoria } from "@/actions/updateCategoria";
import { NextResponse } from "next/server";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': FRONTEND_ORIGIN,
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// Responder preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const result = await updateCategoria(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message, details: result.errors ?? undefined },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
