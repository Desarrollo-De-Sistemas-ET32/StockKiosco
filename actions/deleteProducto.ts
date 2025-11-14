"use server";
import db from "@/lib/db";
import { serializePrismaObject } from "@/lib/utils";

type DeleteProduct = {
  codigo_barra: string;
  id_producto: number;
};

export const deleteProduct = async (values: DeleteProduct) => {
  try {
    const idProducto = values.id_producto;

    // 1. Borrar el stock primero
    await db.stock.deleteMany({
      where: {
        id_producto: idProducto,
      },
    });
    const deletedProducto = await db.productos.deleteMany({
      where: {
        id_producto: idProducto,
      },
    });

    return serializePrismaObject(deletedProducto);
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return { error: "Error deleting producto" };
  }
};
