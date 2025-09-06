'use server'
import db from "@/lib/db";
import { Prisma } from "@prisma/client";


type filtrado = {
    id_usuario?: number,
    nombre?: string,
    email?: string,
    usuario_roles?: string
}

export const filterUser = async(values: filtrado) => {
    try{

        const whereClause: Prisma.usuariosWhereInput = {}


        if (
            (values.id_usuario === undefined || values.id_usuario === null || values.id_usuario === 0) &&
            (values.nombre === undefined || values.nombre.trim() === "" || values.nombre === null) &&
            (values.email === undefined || values.email.trim() === "" || values.email === null) &&
            (values.usuario_roles === undefined || values.usuario_roles.trim() === "" || values.usuario_roles === null)
        ) {
            return { 
                success: false, 
                message: "Debe proporcionar al menos un criterio de búsqueda." 
            };
        }


        if (values.id_usuario !== undefined && values.id_usuario !== null && values.id_usuario !== 0) {
            whereClause.id_usuario = values.id_usuario;
        }


        if (values.nombre !== undefined && values.nombre.trim() !== "" && values.nombre !== null) {
            whereClause.name = { contains: values.nombre.trim(), mode: 'insensitive' };
        }


        if (values.email !== undefined && values.email.trim() !== "" && values.email !== null) {
            whereClause.email = { contains: values.email.trim(), mode: 'insensitive' };
        }


        if (values.usuario_roles !== undefined && values.usuario_roles.trim() !== "" && values.usuario_roles !== null) {
            whereClause.usuarios_roles = {  };
        }


        const usersFound = await db.usuarios.findMany({
            where: whereClause
        });


        if (usersFound.length > 0) {
            return { 
                success: true, 
                message: `Se encontraron ${usersFound.length} usuarios.`, 
                users: usersFound
            };
            
        } else { 
            return { 
                success: false, 
                message: "No se encontraron usuarios con los criterios especificados."
            };
        }
    } catch (error) { 
        console.error("Error en la busqueda:", error);
        return { error: "Error al buscar a los usuarios." };
    }
}