// src/app/api/usuario/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"
const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

type LoginBody = { email?: string; name?: string; password: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;

    if (!body?.password || (!body.email && !body.name)) {
      return NextResponse.json({ error: "Faltan credenciales" }, { status: 400, headers: corsHeaders });
    }

    const where = body.email ? { email: body.email } : { name: body.name as string };
    const user = await db.usuarios.findUnique({
      where,
      select: { id_usuario: true, name: true, email: true, password: true, usuarios_roles: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404, headers: corsHeaders });
    }

    // bcrypt.compare requiere que la contraseña esté hasheada
    const match = await bcrypt.compare(body.password, user.password ?? "");
    if (!match) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401, headers: corsHeaders });
    }

    const safeUser = { id_usuario: user.id_usuario, name: user.name, email: user.email, usuarios_roles: [user.usuarios_roles] };
    return NextResponse.json({ authenticated: true, usuario: safeUser }, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    console.error("Error en login:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500, headers: corsHeaders });
  }
}
