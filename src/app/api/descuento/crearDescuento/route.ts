
import { createDescuento } from "@/actions/addDescuento";
import { NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000', 
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};


export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Body recibido en API:", body);
    const result = await createDescuento(body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (result.success) {
      return NextResponse.json(
        { message: "Descuento creado exitosamente", descuento: result.descuento },
        { status: 201, headers: CORS_HEADERS }
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
