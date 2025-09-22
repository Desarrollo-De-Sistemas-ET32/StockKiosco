import { NextResponse } from "next/server";
import { deleteDescuento } from "@/actions/deleteDescuento";

export async function DELETE(req: Request) {
  try {
    const body = await req.json(); // espera: { id_descuento: 1 } o { id_descuento: "1" }
    const result = await deleteDescuento(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/descuento/eliminarDescuento error:", error?.message ?? error);
    return NextResponse.json({ success: false, error: error?.message ?? "Error" }, { status: 400 });
  }
}
