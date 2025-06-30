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

        if(values.id = values.id){
            whereClause.id_producto = values.id;
        }

        
        if(values.codigo_barra !== undefined){
            whereClause.codigo_barra = values.codigo_barra;
        }


        if(values.nombre !== undefined){
            whereClause.nombre = { contains: values.nombre, mode: 'insensitive' };
        }

        const foundProducts = db.productos.findMany({
            where: whereClause
        })

         if ((await foundProducts).length > 0) {
            return { success: true, message: `Se encontraron ${(await foundProducts).length} productos.`, products: foundProducts };
        } else {
            return { success: false, message: "No se encontraron productos con los criterios especificados." };
        }
    }catch (error) {
        console.error("Error en la busqueda:", error);
        return { error: "Error al buscar producto." };
    }
}