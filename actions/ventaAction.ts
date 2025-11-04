// 'use server'
import db from "@/lib/db";

type DetalleVenta = {
  id_producto: number;
  cantidad: number;
};

export type NuevaVenta = {
  id_usuario: number | string;
  detalles: DetalleVenta[];
  pagado?: boolean;
  descuento_aplicado?: number | null; // id_descuento opcional
};

export const addVenta = async (values: NuevaVenta) => {
  try {
    const id_usuario = Number(values.id_usuario);
    if (!Number.isFinite(id_usuario)) {
      return { success: false, message: "ID de usuario inválido." };
    }

    const usuario = await db.usuarios.findUnique({ where: { id_usuario } });
    if (!usuario) return { success: false, message: `Usuario con ID ${id_usuario} no existe.` };

    if (!Array.isArray(values.detalles) || values.detalles.length === 0) {
      return { success: false, message: "La venta debe contener al menos un detalle." };
    }

    // Agrupar detalles por producto
    const pedidoMap = new Map<number, number>();
    for (const d of values.detalles) {
      const id = Number(d.id_producto);
      if (!Number.isFinite(id)) continue;
      const qty = Math.max(0, Number(d.cantidad) || 0);
      if (qty <= 0) continue;
      pedidoMap.set(id, (pedidoMap.get(id) || 0) + qty);
    }
    const idsProductos = Array.from(pedidoMap.keys());
    if (idsProductos.length === 0) return { success: false, message: "No se encontraron productos válidos en la venta." };

    // Obtener productos
    const productos = await db.productos.findMany({
      where: { id_producto: { in: idsProductos } },
      select: { id_producto: true, precio: true, nombre: true },
    });
    const idsEncontrados = productos.map(p => p.id_producto);
    const faltantes = idsProductos.filter(id => !idsEncontrados.includes(id));
    if (faltantes.length > 0) return { success: false, message: `Productos no existen: ${faltantes.join(", ")}` };

    // Stocks actuales
    const stocks = await db.stock.findMany({
      where: { id_producto: { in: idsProductos } },
      select: { id_producto: true, cantidad: true },
    });
    const stockMap = new Map<number, number>();
    for (const s of stocks) stockMap.set(s.id_producto, s.cantidad ?? 0);

    // Validar stock
    for (const [id, qtySolicitada] of pedidoMap.entries()) {
      const disponible = stockMap.get(id) ?? 0;
      if (disponible < qtySolicitada) {
        const prod = productos.find(p => p.id_producto === id);
        const nombre = prod?.nombre ?? `ID ${id}`;
        return { success: false, message: `Stock insuficiente para ${nombre}. Disponible: ${disponible}` };
      }
    }

    // Calcular detalles y total bruto
    const detallesCalculados = Array.from(pedidoMap.entries()).map(([id, qty]) => {
      const producto = productos.find(p => p.id_producto === id)!;
      const precioUnitario = Number(producto.precio) || 0;
      const subtotal = precioUnitario * qty;
      return {
        id_producto: id,
        cantidad: qty,
        precio_unitario: precioUnitario,
        subtotal,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
      };
    });

    let totalBruto = detallesCalculados.reduce((acc, d) => acc + d.subtotal, 0);

    // Leer descuento seguro desde DB (si se pasó descuento_aplicado)
    let descuentoRecord: { tipo?: string | null; valor?: number | null } | null = null;
    if (values.descuento_aplicado != null) {
      try {
        const d = await db.descuentos.findUnique({
          where: { id_descuento: Number(values.descuento_aplicado) },
          select: { tipo: true, valor: true },
        });
        if (d) descuentoRecord = { tipo: d.tipo ?? null, valor: Number(d.valor ?? 0) };
      } catch {
        descuentoRecord = null;
      }
    }

    // Calcular total final con descuento si corresponde
    let totalFinal = totalBruto;
    if (descuentoRecord && typeof descuentoRecord.valor === "number" && Number(descuentoRecord.valor) > 0) {
      const tipo = (descuentoRecord.tipo ?? "").toString().toLowerCase();
      const val = Number(descuentoRecord.valor || 0);
      if (tipo.includes("porc") || tipo.includes("percent") || tipo.includes("%") || tipo.includes("porcentaje")) {
        totalFinal = Math.max(0, totalBruto * (1 - val / 100));
      } else {
        totalFinal = Math.max(0, totalBruto - val);
      }
    }

    // Transacción: crear venta y decrementar stocks (condición gte).
    // NO metemos id_descuento directamente en el create para evitar error si la columna no existe.
    const nuevaVenta = await db.$transaction(async (tx) => {
      const ventaData: any = {
        id_usuario,
        total: totalFinal,
        pagado: values.pagado ?? false,
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
        detalles_venta: { create: detallesCalculados },
      };

      const ventaCreada = await tx.ventas.create({
        data: ventaData,
        include: { detalles_venta: true },
      });

      // Intentamos actualizar id_descuento si vino descuento_aplicado.
      if (values.descuento_aplicado != null) {
        try {
          await tx.ventas.update({
            where: { id_venta: ventaCreada.id_venta },
            data: { id_descuento: Number(values.descuento_aplicado) },
          });
        } catch (upErr: any) {
          // Si falla porque la columna no existe (Unknown argument 'id_descuento'), lo ignoramos.
          const msg = String(upErr?.message ?? upErr);
          if (msg.includes("Unknown argument") || msg.includes("Unknown field") || msg.includes("id_descuento")) {
            // columna no existe en el esquema: no hacemos nada (no queremos rollback por esto)
          } else {
            // si es otro error, lo re-lanzamos para que haga rollback
            throw upErr;
          }
        }
      }

      // Actualizar stocks (condición gte). Si alguna updateMany afecta 0 filas -> rollback.
      for (const [id, qty] of pedidoMap.entries()) {
        const res = await tx.stock.updateMany({
          where: { id_producto: id, cantidad: { gte: qty } },
          data: { cantidad: { decrement: qty }, fecha_actualizacion: new Date() },
        });
        if (res.count === 0) {
          throw new Error(`Stock insuficiente al actualizar producto ${id}`);
        }
      }

      return ventaCreada;
    });

    return { success: true, message: "Venta registrada correctamente.", venta: nuevaVenta };
  } catch (error: any) {
    console.error("Error al registrar venta:", error);
    const msg = typeof error?.message === "string" ? error.message : "Ocurrió un error al registrar la venta.";
    return { success: false, message: msg, error: error?.message ?? String(error) };
  }
};
