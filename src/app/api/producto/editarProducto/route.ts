import { updateProduct } from "@/actions/updateProducto";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const result = await updateProduct(body);

    if (!result.success) {
      return NextResponse.json({ error: result.message, details: result.errors ?? undefined }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
