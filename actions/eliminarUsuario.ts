'use server'
import db from "../src/lib/db";
type Usuario = {
    email: string;
}
export const deleteUser = async(values: Usuario) => {
    try {
        // Lógica de eliminación en la base de datos
        await db.usuarios.delete({
            where: {
                email: values.email
            }
        });
        // Si todo sale bien, retorna un objeto simple indicando éxito
        return { success: true, message: `Usuario con email ${values.email} eliminado exitosamente.` };

    } catch (error) {
        console.error("Error creating product:", error);
    return { error: "Error creating product" };
    }
};