import db from "@/src/lib/db";
import { deleteDescuentoSchema, DeleteDescuentoInput } from "@/schemas/descuento_scheme";

export const deleteDescuento = async (values: unknown) => {
  try {
    // Normalizar / castear manualmente si viene string
    const maybe = values as any;
    const normalized = {
      ...maybe,
      id_descuento:
        typeof maybe?.id_descuento === "string"
          ? Number(maybe.id_descuento)
          : maybe?.id_descuento,
    };

    if (normalized.id_descuento === undefined || Number.isNaN(normalized.id_descuento)) {
      throw new Error("id_descuento inválido o ausente");
    }

    // ahora validamos con Zod estricto (espera number)
    const parsed = deleteDescuentoSchema.parse(normalized) as DeleteDescuentoInput;

    const deleted = await db.descuentos.delete({
      where: { id_descuento: parsed.id_descuento },
    });

    return { success: true, data: deleted };
  } catch (error: any) {
    console.error("Error eliminando descuento:", error);
    return { success: false, error: error?.message ?? "Error eliminando descuento" };
  }
};
