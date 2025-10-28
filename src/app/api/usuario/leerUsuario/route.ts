// src/app/api/usuario/leerUsuario/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"
const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const usuarios = await db.usuarios.findMany({
      orderBy: { id_usuario: "asc" },
      select: { id_usuario: true, name: true, email: true },
    });
    return NextResponse.json({ usuarios }, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    console.error("Error leyendo usuarios:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500, headers: corsHeaders });
  }
}
