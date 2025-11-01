"use server"
import db from "@/lib/db";
import { serializePrismaObject } from "@/lib/utils";

type DeleteProduct = {
    codigo_barra: string;
}

export const deleteProduct = async (values: DeleteProduct) => {
    try {
        const deletedProducto = await db.productos.deleteMany({
            where: {
                codigo_barra: serializePrismaObject(values.codigo_barra),
            },
        });

        return serializePrismaObject(deletedProducto);
    } catch (error) {
        console.error("Error eliminando producto:", error);
        return { error: "Error deleting producto" };
    }
}