// src/app/api/producto/leerProducto/route.ts
import { NextResponse } from "next/server";
import { readProductos } from "@/actions/readProducto";

export async function GET() {
  const result = await readProductos();
  return NextResponse.json(result);
}
