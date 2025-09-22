// src/actions/updateDescuento.ts
import db from "@/src/lib/db";
import { updateDescuentoSchema, UpdateDescuentoInput } from "@/schemas/descuento_scheme";

const parseDateIfString = (v: any) => {
  if (v === undefined || v === null) return v;
  if (typeof v === "string") return new Date(v);
  if (v instanceof Date) return v;
  return v;
};

export const updateDescuento = async (values: unknown) => {
  try {
    const parsed = updateDescuentoSchema.parse(values) as UpdateDescuentoInput;

    // Construir objeto `data` sólo con campos definidos
    const data: any = {
      nombre: parsed.nombre,
      descripcion: parsed.descripcion,
      tipo: parsed.tipo,
      valor: parsed.valor,
      fecha_inicio: parsed.fecha_inicio ? parseDateIfString(parsed.fecha_inicio) : undefined,
      fecha_fin:
        parsed.fecha_fin === null
          ? null
          : parsed.fecha_fin
          ? parseDateIfString(parsed.fecha_fin)
          : undefined,
      fecha_actualizacion: parsed.fecha_actualizacion
        ? new Date(parsed.fecha_actualizacion)
        : new Date(),
      activo: parsed.activo,
    };

    // eliminar campos undefined
    const clean = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

    const updated = await db.descuentos.update({
      where: { id_descuento: parsed.id_descuento },
      data: clean,
    });

    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error actualizando descuento:", error);
    return { success: false, error: error?.message ?? "Error actualizando descuento" };
  }
};
