"use server";
import db from "@/lib/db";

type CreateDescuentoValues = {
    id_descuento: number; 
    nombre: string; 
    descripcion: string; 
    tipo: "PORCENTAJE" | "MONTOFIJO";
    valor: number;
    fecha_inicio: Date; 
    fecha_fin: Date; 
};

export const createDescuento = async (values: CreateDescuentoValues) => {
    console.log("Valores recibidos para crear descuento:", values); 
    
    if (!values.nombre || typeof values.nombre !== "string") {
      return { error: "El nombre del descuento es obligatorio." };
    }
    
    try {
    const descuento = await db.descuentos.create({
      data: {
        nombre: values.nombre,
        descripcion: values.descripcion,
        tipo: values.tipo,
        valor: values.valor,
        fecha_inicio: values.fecha_inicio,
        fecha_fin: values.fecha_fin,
        fecha_actualizacion: new Date()
      },
    });
    console.log("Descuento creado:", descuento);
    return { success: true, descuento };
  } catch (error) {
    console.error("Error al crear un descuento:", error);
    return { error: "Error al crear un descuento" };
  }
};