import { updateProveedor } from "@/actions/updateProveedor";
import { NextResponse } from "next/server";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"

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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en PATCH:", body);

    const result = await updateProveedor(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400, headers: CORS_HEADERS });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400, headers: CORS_HEADERS });
    }

    console.log("Resultado de la actualización:", result);
    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error("API error (updateProveedor):", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
