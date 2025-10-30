import { NextResponse } from "next/server";
import db from "@/lib/db";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const logs = await db.logs.findMany({
      orderBy: { fecha_creacion: "desc" },
      include: {
        usuarios: {
          select: {
            id_usuario: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedLogs = logs.map((log) => ({
      id_log: log.id_log,
      accion: log.accion,
      descripcion: log.descripcion,
      fecha_creacion: log.fecha_creacion,
      usuario: log.usuarios
        ? {
            id: log.usuarios.id_usuario,
            nombre: log.usuarios.name,
            email: log.usuarios.email,
          }
        : null,
    }));

    return NextResponse.json(formattedLogs, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error al obtener logs:", error);
    return NextResponse.json(
      { error: "Error al obtener los registros" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_usuario, accion, descripcion } = body;

    if (!accion) {
      return NextResponse.json(
        { error: "El campo 'accion' es obligatorio" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const nuevoLog = await db.logs.create({
      data: {
        id_usuario: id_usuario || null,
        accion,
        descripcion,
      },
    });

    return NextResponse.json(nuevoLog, {
      status: 201,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error al crear log:", error);
    return NextResponse.json(
      { error: "Error interno al crear el log" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
