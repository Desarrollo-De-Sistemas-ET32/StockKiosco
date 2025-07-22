"use server";
import db from "@/lib/db";

type CreateDescuentoValues = {
    id_descuento: number; // Optional for auto-increment
    nombre: string; // Required, cannot be empty
    descripcion: string; // Optional, defaults to empty string
    tipo: "PORCENTAJE" | "MONTOFIJO";
    valor: number;
    fecha_inicio: Date; // Optional, defaults to now()
    fecha_fin: Date; // Optional, defaults to null
};

export const createDescuento = async (values: CreateDescuentoValues) => {
    console.log("Valores recibidos para crear descuento:", values); // Log the received values
    
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
    console.log("Descuento creado:", descuento); // Log the created discount
    return { success: true, descuento };
  } catch (error) {
    console.error("Error al crear un descuento:", error);
    return { error: "Error al crear un descuento" };
  }
};