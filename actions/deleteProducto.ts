"use server"
import db from "@/lib/db";
type DeleteProduct = {
    codigo_barra: number;
}

export const deleteProduct = async (values: DeleteProduct) => {
    try {
        await db.productos.delete({
            where: {
                codigo_barra: values.codigo_barra
            }
        });

        return { success: true, message: `Producto con código de barra ${values.codigo_barra} eliminado exitosamente.` };
    } catch (error) {
        console.error("Error eliminando producto:", error);
        return { error: "Error deleting producto" };
    }
}