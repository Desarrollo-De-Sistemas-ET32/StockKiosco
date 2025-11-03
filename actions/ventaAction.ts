'use server'

import db from "@/lib/db";
import { nuevaVentaSchema } from "@/schemas/ventas_scheme"; 

export const addVenta = async (values: unknown) => {
  try {

    const parsed = nuevaVentaSchema.parse(values);

    const id_usuario = parsed.id_usuario;


    const usuario = await db.usuarios.findUnique({
      where: { id_usuario },
    });

    if (!usuario) {
      return { success: false, message: `El usuario con ID ${id_usuario} no existe.` };
    }


    const idsProductos = parsed.detalles.map((d) => d.id_producto);
    const productos = await db.productos.findMany({
      where: { id_producto: { in: idsProductos } },
      select: { id_producto: true, precio: true },
    });

    const idsEncontrados = productos.map((p) => p.id_producto);
    const faltantes = idsProductos.filter((id) => !idsEncontrados.includes(id));

    if (faltantes.length > 0) {
      return {
        success: false,
        message: `Los siguientes productos no existen: ${faltantes.join(", ")}.`,
      };
    }


    const detallesCalculados = parsed.detalles.map((d) => {
      const producto = productos.find((p) => p.id_producto === d.id_producto)!;
      const subtotal = Number(producto.precio) * d.cantidad;
      return {
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        precio_unitario: producto.precio,
        subtotal,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      };
    });

    const total = detallesCalculados.reduce((acc, det) => acc + det.subtotal, 0);


    const nuevaVenta = await db.ventas.create({
      data: {
        id_usuario,
        total,
        pagado: parsed.pagado ?? false,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        detalles_venta: {
          create: detallesCalculados,
        },
      },
      include: { detalles_venta: true },
    });


    for (const d of parsed.detalles) {
      await db.stock.updateMany({
        where: { id_producto: d.id_producto },
        data: {
          cantidad: { decrement: d.cantidad },
          fecha_actualizacion: new Date(),
        },
      });
    }

    return { success: true, message: "Venta registrada correctamente.", venta: nuevaVenta };
  } catch (error: any) {

    if (error.name === "ZodError") {
      return {
        success: false,
        message: "Datos inválidos.",
        errors: error.errors, 
      };
    }


    console.error("Error al registrar la venta:", error);
    return {
      success: false,
      message: "Ocurrió un error al registrar la venta.",
      error: error.message || error,
    };
  }
};
