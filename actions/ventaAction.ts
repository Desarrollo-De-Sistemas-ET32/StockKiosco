'use server'
import db from "@/lib/db";

type DetalleVenta = {
  id_producto: number;
  cantidad: number;
};

export type NuevaVenta = {
  id_usuario: number | string;
  detalles: DetalleVenta[];
  pagado?: boolean;
};

export const addVenta = async (values: NuevaVenta) => {
  try {
    const id_usuario = Number(values.id_usuario);

    const usuario = await db.usuarios.findUnique({ where: { id_usuario } });
    if (!usuario) return { success: false, message: `Usuario con ID ${id_usuario} no existe.` };

    const idsProductos = values.detalles.map(d => d.id_producto);
    const productos = await db.productos.findMany({
      where: { id_producto: { in: idsProductos } },
      select: { id_producto: true, precio: true },
    });

    const idsEncontrados = productos.map(p => p.id_producto);
    const faltantes = idsProductos.filter(id => !idsEncontrados.includes(id));
    if (faltantes.length > 0) return { success: false, message: `Productos no existen: ${faltantes.join(", ")}` };

    const detallesCalculados = values.detalles.map(d => {
      const producto = productos.find(p => p.id_producto === d.id_producto)!;
      const subtotal = Number(producto.precio) * d.cantidad;
      return { ...d, precio_unitario: producto.precio, subtotal, fecha_creacion: new Date(), fecha_actualizacion: new Date() };
    });

    const total = detallesCalculados.reduce((acc, det) => acc + det.subtotal, 0);

    const nuevaVenta = await db.ventas.create({
      data: {
        id_usuario,
        total,
        pagado: values.pagado ?? false,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        detalles_venta: { create: detallesCalculados },
      },
      include: { detalles_venta: true },
    });

    // Actualizar stock
    for (const d of values.detalles) {
      await db.stock.updateMany({
        where: { id_producto: d.id_producto },
        data: { cantidad: { decrement: d.cantidad }, fecha_actualizacion: new Date() },
      });
    }

    return { success: true, message: "Venta registrada correctamente.", venta: nuevaVenta };
  } catch (error: any) {
    console.error("Error al registrar venta:", error);
    return { success: false, message: "Ocurrió un error al registrar la venta.", error: error.message || error };
  }
};
