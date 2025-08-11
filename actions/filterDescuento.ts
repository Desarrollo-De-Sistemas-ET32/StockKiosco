'use server'

import db from "@/lib/db";

export const getAllDiscounts = async () => {
    try {
        const discounts = await db.descuentos.findMany({
            orderBy: {
                id_descuento: 'asc',
            },
        });

        return {
            success: true,
            message: `Se encontraron ${discounts.length} registros.`,
            data: discounts
        };
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return {
            success: false,
            message: "Error al obtener los datos de la base de datos.",
            error: String(error) 
        };
    }
};
