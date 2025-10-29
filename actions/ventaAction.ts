'use server'
import db from "@/lib/db";

type DetalleVenta = {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
};

type NuevaVenta = {
  id_usuario: number | string;
  detalles: DetalleVenta[];
  total: number;
  pagado?: boolean;
};

export const addVenta = async (values: NuevaVenta) => {
  try {
    const id_usuario = Number(values.id_usuario);

    // 🔹 Validar usuario existente
    const usuarioExiste = await db.usuarios.findUnique({
      where: { id_usuario },
    });
    if (!usuarioExiste) {
      return { success: false, message: `El usuario con ID ${id_usuario} no existe.` };
    }

    // 🔹 Validar productos
    const idsProductos = values.detalles.map((d) => d.id_producto);
    const productosExistentes = await db.productos.findMany({
      where: { id_producto: { in: idsProductos } },
      select: { id_producto: true },
    });

    const idsEncontrados = productosExistentes.map((p) => p.id_producto);
    const idsFaltantes = idsProductos.filter((id) => !idsEncontrados.includes(id));

    if (idsFaltantes.length > 0) {
      return { success: false, message: `Los siguientes productos no existen: ${idsFaltantes.join(", ")}` };
    }

    // 🔹 Crear venta
    const nuevaVenta = await db.ventas.create({
      data: {
        id_usuario,
        total: values.total,
        pagado: values.pagado ?? false,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        detalles_venta: {
          create: values.detalles.map((d) => ({
            id_producto: d.id_producto,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            subtotal: d.cantidad * d.precio_unitario,
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date(),
          })),
        },
      },
      include: { detalles_venta: true },
    });

    // 🔹 Actualizar stock
    for (const d of values.detalles) {
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
    console.error("Error al registrar la venta:", error);
    return {
      success: false,
      message: "Ocurrió un error al registrar la venta.",
      error: error.message || error,
    };
  }
};
