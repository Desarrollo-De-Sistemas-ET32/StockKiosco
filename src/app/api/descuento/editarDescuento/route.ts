import { NextRequest, NextResponse } from "next/server";
import { updateDescuento } from "@/actions/updateDescuento";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': FRONTEND_ORIGIN, 
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};


export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

async function handleUpdate(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await updateDescuento(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("PUT/PATCH /api/descuento/editarDescuento error:", error?.message ?? error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Error" },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

export async function PUT(req: NextRequest) {
  return handleUpdate(req);
}

export async function PATCH(req: NextRequest) {
  return handleUpdate(req);
}
