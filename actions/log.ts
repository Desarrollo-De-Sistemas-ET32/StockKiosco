'use server'
import db from "@/lib/db";

type NuevoLog = {
  id_usuario?: number;
  accion: string;
  descripcion?: string;
};

export const addLog = async (values: NuevoLog) => {
  try {
    if (!values.accion || values.accion.trim() === "") {
      return { success: false, message: "El campo 'acción' es obligatorio." };
    }

    const nuevoLog = await db.logs.create({
      data: {
        id_usuario: values.id_usuario ?? null,
        accion: values.accion.trim(),
        descripcion: values.descripcion?.trim() ?? null,
        fecha_creacion: new Date(),
      },
    });

    return {
      success: true,
      message: "Log registrado correctamente.",
      log: nuevoLog,
    };
  } catch (error: any) {
    console.error("Error al registrar el log:", error);
    return {
      success: false,
      message: "Ocurrió un error al registrar el log.",
      error: error.message || error,
    };
  }
};
