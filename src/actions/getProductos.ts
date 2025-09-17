import { NextResponse } from "next/server";
import db from "@/lib/db";

export default async function getProducts() {
    try {
        const products = await db.productos.findMany(
            {
                include: {
                    proveedores: true,
                    stock: true,
                }
            }
        );
        return {
            success: true,
            message: "Datos obtenidos correctamente.",
            body: products
        };
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return NextResponse.json({
            success: false,
            message: "Error al obtener los datos de la base de datos.",
            error: String(error)
        }, { status: 500 });
    }
}