import { createProduct } from "@/actions/addProducto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await createProduct(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Retornamos únicamente el producto creado
    return NextResponse.json({ product: result.product });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
