'use server'
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

type filtrado = {
    id: number,
    nombre: string,
    codigo_barra: number
}

export const filterProduct = async(values: filtrado) => {
    try{
        const whereClause: Prisma.productosWhereInput = {}

        // Validar que al menos uno de los campos de búsqueda esté definido
        // y no sea nulo o vacío.
        // Si todos los campos son nulos o vacíos, retornar un mensaje de error.
        if(
            (values.id === undefined || values.id === null || values.id === 0) &&
            (values.codigo_barra === undefined || values.codigo_barra === null) &&
            (values.nombre === undefined || values.nombre.trim() === "" || values.nombre === null)
        ){
            return { 
                success: false, 
                message: "Debe proporcionar al menos un criterio de búsqueda." 
            };
        }

        if(values.id !== undefined && values.id !== null && values.id !== 0){
            whereClause.id_producto = values.id;
        }

        
        if(values.codigo_barra !== undefined || values.codigo_barra !== null){
            whereClause.codigo_barra = values.codigo_barra;
        }


        if(values.nombre !== undefined && values.nombre.trim() !== "" && values.nombre !== null){
            whereClause.nombre = { contains: values.nombre.trim(), mode: 'insensitive' };
        }

        const foundProducts = await db.productos.findMany({
            where: whereClause
        })

         if (foundProducts.length > 0) {
            return { 
                success: true, 
                message: `Se encontraron ${foundProducts.length} productos.`, 
                products: foundProducts 
            };
        } else {
            return { 
                success: false, 
                message: "No se encontraron productos con los criterios especificados." 
            };
        }
    }catch (error) {
        console.error("Error en la busqueda:", error);
        return { error: "Error al buscar producto." };
    }
}