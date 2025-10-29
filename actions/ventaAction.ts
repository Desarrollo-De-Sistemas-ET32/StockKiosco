'use server'
import db from "@/lib/db";

type DetalleVenta = {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
};

type NuevaVenta = {
  id_usuario: number;
  detalles: DetalleVenta[];
  total: number;
  pagado?: boolean;
};

export const addVenta = async (values: NuevaVenta) => {
  try {

    if (!values.id_usuario || values.id_usuario <= 0) {
      return { success: false, message: "Debe especificar un usuario válido." };
    }

    if (!values.detalles || values.detalles.length === 0) {
      return { success: false, message: "Debe agregar al menos un producto en la venta." };
    }

    const nuevaVenta = await db.ventas.create({
      data: {
        id_usuario: values.id_usuario,
        fecha_venta: new Date(),
        total: values.total,
        pagado: values.pagado ?? false,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        detalles_venta: {
          create: values.detalles.map((detalle) => ({
            id_producto: detalle.id_producto,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.cantidad * detalle.precio_unitario,
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date(),
          })),
        },
      },
      include: {
        detalles_venta: true,
      },
    });

    // Actualizar stock de cada producto vendido
    for (const item of values.detalles) {
      await db.stock.updateMany({
        where: { id_producto: item.id_producto },
        data: {
          cantidad: {
            decrement: item.cantidad,
          },
          fecha_actualizacion: new Date(),
        },
      });
    }

    return {
      success: true,
      message: "Venta registrada correctamente.",
      venta: nuevaVenta,
    };
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    return {
      success: false,
      message: "Ocurrió un error al registrar la venta.",
      error: String(error),
    };
  }
};
