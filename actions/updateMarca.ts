import db from "@/lib/db";
import { updateMarcaSchema } from "@/schemas/marca_scheme";

export const updateMarca = async (values: unknown) => {
    
    const validatedData = updateMarcaSchema.safeParse(values);
    
    if (!validatedData.success) {
      return {
        error: "Datos inválidos",
        details: validatedData.error.flatten().fieldErrors,
      };
    }

    const data = validatedData.data;

    try {
        await db.marcas.update({
            where: { id_marca: data.id_marca },
            data: {
                nombre_marca: data.nombre,
            },
        });
        return {
            success: true,
            message: "Marca actualizada correctamente.",
            marca: {id: data.id_marca, nombre: data.nombre},
        };
    } catch (err: any) {
        if (err.code === 'P2025') {
            return {
                success: false,
                message: "No se encontró la marca con el ID proporcionado.",
            };
        }

        console.error("Error al actualizar la marca:", err);
        return {
            error: "Al actualizar la marca",
            message: "Ocurrió un error al actualizar la marca.",
        };
  }
};