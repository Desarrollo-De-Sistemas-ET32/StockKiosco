import { updateProveedor } from "@/actions/updateProveedor";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en PATCH:", body); // <-- Agrega esto
    const result = await updateProveedor(body); 

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    console.log("Resultado de la actualización:", result); // <-- Agrega esto
    return NextResponse.json(result);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}