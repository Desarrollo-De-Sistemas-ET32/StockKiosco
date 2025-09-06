import { updateProduct } from "@/actions/updateProducto";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en PATCH:", body);

    const result = await updateProduct(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message, errors: result.errors ?? undefined },
        { status: 400 }
      );
    }

    console.log("Resultado de la actualización:", result);
    return NextResponse.json({ success: true, message: result.message, product: result.product });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
