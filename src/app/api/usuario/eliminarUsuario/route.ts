import { deleteUser } from "@/actions/deleteUsuario";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const result = await deleteUser(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }


    await db.logs.create({
      data: {
        id_usuario: body.id_usuario_admin || null,
        accion: "Eliminación de usuario",
        descripcion: `El usuario con ID ${body.id_usuario} fue eliminado correctamente.`,
      },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
