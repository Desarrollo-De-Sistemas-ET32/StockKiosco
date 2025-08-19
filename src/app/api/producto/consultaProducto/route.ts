// app/api/producto/consultaProducto/route.ts
import { NextResponse } from "next/server";
import { getProducts } from "@/actions/getProductos"; 

export async function GET() {
    try {
        const result = await getProducts();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error en GET /consultaProducto:", error);
        return NextResponse.json(
            { success: false, message: "Error en el servidor", error: String(error) },
            { status: 500 }
        );
    }
}
export { getProducts };