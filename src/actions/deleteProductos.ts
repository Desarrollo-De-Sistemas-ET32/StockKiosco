"use server"
import db from "@/lib/db";
type DeleteProduct = {
    id_producto: number;
}

export const deleteProduct = async (values: DeleteProduct) => {
    try {
        const existing = await db.productos.findUnique({ where: { id_producto: values.id_producto } });
        if (!existing) {
            return { error: "Producto no encontrado" };
        }
        // Primero elimina los registros relacionados en la tabla 'stock'
        await db.stock.deleteMany({ where: { id_producto: values.id_producto } });
        const deleted = await db.productos.delete({ where: { id_producto: values.id_producto } });
        return { success: true, body: deleted };
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        return { error: "Error al eliminar el producto" };
    }
};