import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import db from "@/lib/db"

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = body.name ?? body.nombre
    const email = body.email
    const password = body.password
    const id_usuario_admin = body.id_usuario_admin || null

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400, headers: corsHeaders })
    }

    const existe = await db.usuarios.findUnique({
      where: { email },
      select: { id_usuario: true },
    })

    if (existe) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409, headers: corsHeaders })
    }

    const hashed = await bcrypt.hash(password, 10)
    const usuario = await db.usuarios.create({
      data: {
        name,
        email,
        password: hashed,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      },
    })

    await db.logs.create({
      data: {
        id_usuario: id_usuario_admin, 
        accion: "Creación de usuario",
        descripcion: `El usuario '${name}' (${email}) fue creado correctamente.`,
      },
    })

    const safeUser = { id_usuario: usuario.id_usuario, name: usuario.name, email: usuario.email }

    return NextResponse.json({ usuario: safeUser }, { status: 201, headers: corsHeaders })
  } catch (err: any) {
    console.error("Error en agregarUsuario:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500, headers: corsHeaders })
  }
}
