// src/app/api/producto/verProducto/route.ts
import { NextResponse } from "next/server";
import getProducts from "@/actions/getProductos";

export async function GET() {
  try {
    const result = await getProducts();

    // Esta es la forma correcta de usar el replacer
    const replacer = (key, value) =>
      typeof value === "bigint" ? value.toString() : value;

    // Serializa el resultado ANTES de pasarlo a NextResponse
    const serializedResult = JSON.stringify(result, replacer);

    // Devuelve la respuesta como JSON
    return new NextResponse(serializedResult, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}