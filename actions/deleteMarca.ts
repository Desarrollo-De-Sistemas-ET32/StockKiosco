'use server'

import db from "@/lib/db";

type DeleteMarca = {
    id: number;
}
export const deleteMarca = async (values: DeleteMarca) => {
    try {
        await db.marcas.delete({
            where: {
                id_marca: values.id
            }
        });

        return { success: true, message: `Marca con ID ${values.id} eliminada exitosamente.` };
    } catch (error) {
        console.error("Error eliminando marca:", error);
        return { error: "Error deleting marca" };
    }
}