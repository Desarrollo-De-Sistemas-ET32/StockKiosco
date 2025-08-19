import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
        const products = await db.productos.findMany({
            orderBy: {
                id_descuento: 'asc',
            },
        });

        return NextResponse.json({
            success: true,
            message: `Se encontraron ${products.length} registros.`,
            data: products
        });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return NextResponse.json({
            success: false,
            message: "Error al obtener los datos de la base de datos.",
            error: String(error)
        }, { status: 500 });
    }
}