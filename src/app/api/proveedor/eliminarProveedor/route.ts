import { deleteProveedor } from "@/actions/eliminarProveedor"; // Asegúrate que esta ruta sea correcta
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en DELETE:", body);

    const result = await deleteProveedor(body);

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (!result?.success) {
      return NextResponse.json({ error: result.message || "Error desconocido" }, { status: 400 });
    }

    console.log("Resultado de la eliminación:", result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
