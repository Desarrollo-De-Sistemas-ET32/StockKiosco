"use server";
import db from "@/lib/db";
import { updateProductSchema } from "@/schemas/producto_scheme";
import { serializePrismaObject } from "@/lib/utils";
import { z } from "zod";

export const updateProduct = async (values: unknown) => {
  try {
    const validatedData = updateProductSchema.parse(values);
    console.log("--- DATOS VALIDADOS POR ZOD (BACKEND) ---:", validatedData); // --- 1. ESTA ES LA CORRECCIÓN ---

    // Los nombres deben coincidir EXACTAMENTE con tu log
    const {
      id_producto,
      stock,
      stock_minimo,
      id_categoria, // 👈 CORREGIDO (antes 'categoria_id')
      id_marca, // 👈 CORREGIDO (antes 'marca_id')
      ...productData
    } = validatedData;

    const updateData: any = { ...productData }; // 2. Convertir BigInt (esto está bien)

    if (updateData.codigo_barra) {
      updateData.codigo_barra = BigInt(updateData.codigo_barra);
    } // 3. Asignar fecha de actualización (esto está bien)

    updateData.fecha_actualizacion = new Date(); // 4. ❌ BORRASTE EL BLOQUE if(categoria) {...} (¡MUY BIEN!)

    // 5. ✅ ASIGNAR IDs DIRECTAMENTE
    // Esta parte ahora funcionará porque las variables SÍ existen
    if (id_categoria) {
      updateData.id_categoria = id_categoria;
    }
    if (id_marca) {
      updateData.id_marca = id_marca;
    } // 6. Lógica de Stock (esto está bien)

    const stockUpdatePayload: any = {};
    if (stock !== undefined) stockUpdatePayload.cantidad = stock;
    if (stock_minimo !== undefined)
      stockUpdatePayload.cantidad_min = stock_minimo;

    if (Object.keys(stockUpdatePayload).length > 0) {
      updateData.stock = {
        updateMany: {
          where: { id_producto: id_producto },
          data: stockUpdatePayload,
        },
      };
    } // 7. Ejecutar la transacción

    const updatedProduct = await db.productos.update({
      where: { id_producto: id_producto },
      data: updateData, // 'updateData' ahora tiene { id_categoria: 7, id_marca: 1 }
      include: { stock: true, categoria: true, marcas: true },
    });

    return {
      success: true,
      message: "Producto actualizado correctamente",
      product: serializePrismaObject(updatedProduct),
    };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        message: "Error de validación en los datos enviados",
        errors: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      };
    }

    if (err.code === "P2025") {
      return {
        success: false,
        message: "No se encontró el producto con el ID proporcionado",
      };
    }

    console.error("Error en updateProduct:", err);
    return {
      success: false,
      message: "Error interno del servidor",
    };
  }
};
