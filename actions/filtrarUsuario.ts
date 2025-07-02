'use server'
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

// Definimos 'filtrado' como un tipo que nos permite definir los campos de búsqueda.
type filtrado = {
    id_usuario?: number,
    nombre?: string,
    email?: string,
    usuario_roles?: string
}

export const filterUser = async(values: filtrado) => {
    try{
        // Definimos 'whereClause' como un objeto que nos permite construir la consulta de búsqueda.
        const whereClause: Prisma.usuariosWhereInput = {}

        // Valida que al menos uno de los campos de búsqueda esté definido
        if (
            (values.id_usuario === undefined || values.id_usuario === null || values.id_usuario === 0) &&
            (values.nombre === undefined || values.nombre.trim() === "" || values.nombre === null) &&
            (values.email === undefined || values.email.trim() === "" || values.email === null) &&
            (values.usuario_roles === undefined || values.usuario_roles.trim() === "" || values.usuario_roles === null)
        ) {
            return { // Si todos los campos son nulos o vacíos, retornar un mensaje de error.
                success: false, 
                message: "Debe proporcionar al menos un criterio de búsqueda." 
            };
        }

        // Valida que 'id_usuario' no sea 0 o tenga de valor null o undefined.
        if (values.id_usuario !== undefined && values.id_usuario !== null && values.id_usuario !== 0) {
            whereClause.id_usuario = values.id_usuario;
        }

        // Valida que 'nombre' no este vació o tenga de valor null o undefined.
        if (values.nombre !== undefined && values.nombre.trim() !== "" && values.nombre !== null) {
            whereClause.name = { contains: values.nombre.trim(), mode: 'insensitive' };
        }

        // Valida que 'email' no este vació o tenga de valor null o undefined.
        if (values.email !== undefined && values.email.trim() !== "" && values.email !== null) {
            whereClause.email = { contains: values.email.trim(), mode: 'insensitive' };
        }

        // Valida que 'usuario_roles' no este vació o tenga de valor null o undefined.
        if (values.usuario_roles !== undefined && values.usuario_roles.trim() !== "" && values.usuario_roles !== null) {
            whereClause.usuarios_roles = {  };
        }

        // Definimos 'usersFound' como una variable que nos permite almacenar el resultado de la búsqueda.
        const usersFound = await db.usuarios.findMany({
            where: whereClause
        });

        // Si al momento de dar respuesta, se encontraron usuarios, retorna un mensaje de éxito y muestra el listado.
        if (usersFound.length > 0) {
            return { 
                success: true, 
                message: `Se encontraron ${usersFound.length} usuarios.`, 
                users: usersFound
            };
            
        } else { // Caso contrario, retorna mensaje de error.
            return { 
                success: false, 
                message: "No se encontraron usuarios con los criterios especificados."
            };
        }
    } catch (error) { // Atrapando errores en la búsqueda.
        console.error("Error en la busqueda:", error);
        return { error: "Error al buscar a los usuarios." };
    }
}