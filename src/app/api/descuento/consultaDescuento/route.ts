// app/api/descuento/consultaDescuento/route.ts
import { NextResponse } from "next/server";
import { getAllDiscounts } from "@/actions/filterDescuento"; 

export async function GET() {
    try {
        const result = await getAllDiscounts();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error en GET /consultaDescuento:", error);
        return NextResponse.json(
            { success: false, message: "Error en el servidor", error: String(error) },
            { status: 500 }
        );
    }
}
export { getAllDiscounts };

