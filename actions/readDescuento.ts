'use server';

import db from "@/lib/db";
import { serializePrismaObject } from "@/lib/utils";

export const readDescuento = async () => {
  try {
    const descuentos = await db.descuentos.findMany({
      orderBy: { fecha_creacion: 'desc' },
    });

    return { descuentos: serializePrismaObject(descuentos) };
  } catch (error: any) {
    console.error("Error leyendo descuentos:", error);
    return { error: error?.message ?? "Error desconocido al leer descuentos" };
  }
};
