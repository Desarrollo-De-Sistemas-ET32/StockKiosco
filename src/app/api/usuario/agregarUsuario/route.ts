
import { NextResponse } from "next/server";
import { crearUsuarioSchema } from "@/schemas/usuario_scheme";
import { createUsuario } from "@/actions/addUsuario";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // validar con Zod (si tu schema incluye telefono/direccion, la validación pasará)
    const parsed = crearUsuarioSchema.parse(body);

    const finalName =
      (parsed.name && String(parsed.name).trim()) ||
      (parsed.nombre && String(parsed.nombre).trim()) ||
      "";

    if (!finalName) {
      return NextResponse.json({ error: "Se requiere el nombre del usuario." }, { status: 400 });
    }

    const result = await createUsuario({
      name: finalName,
      email: parsed.email,
      password: parsed.password,
      telefono: parsed.telefono,
      direccion: parsed.direccion,
      usuarios_roles: parsed.usuarios_roles,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
    });

    if ((result as any).error) {
      const status = (result as any).error.includes("registrado") ? 409 : 400;
      return NextResponse.json({ error: (result as any).error }, { status });
    }

    // Si hubo campos ignorados, devolvemos ese dato para que sepas qué no se guardó
    if ((result as any).ignored) {
      return NextResponse.json(
        { usuario: (result as any).usuario, note: "Campos no guardados", ignored: (result as any).ignored },
        { status: 201 }
      );
    }

    return NextResponse.json((result as any).usuario, { status: 201 });
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("addusuario route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST para crear usuarios." }, { status: 405 });
}
