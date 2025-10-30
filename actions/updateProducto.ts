"use server";
import db from "@/lib/db";
import { updateProductSchema } from "@/schemas/producto_scheme";
import { serializePrismaObject } from "@/lib/utils";
import { z } from "zod"; // Asegúrate de importar 'z'

export const updateProduct = async (values: unknown) => {
  try {
    const validatedData = updateProductSchema.parse(values);

    // ¡AÑADE ESTA LÍNEA DE DEBUGGING!
    console.log("Datos DESPUÉS de Zod:", validatedData);

    // 1. DESESTRUCTURACIÓN CORREGIDA:
    //    Cambiamos 'stock_min' por 'stock_minimo' para que coincida con tus datos
    const { id_producto, stock, categoria, stock_minimo, ...productData } =
      validatedData;

    const updateData: any = { ...productData };

    // 2. Convertir BigInt (String -> BigInt)
    if (updateData.codigo_barra) {
      updateData.codigo_barra = BigInt(updateData.codigo_barra);
    }

    // 3. AÑADIR FECHA DE ACTUALIZACIÓN (para la tabla 'productos')
    //    Tu schema 'productos' lo requiere y no tiene @updatedAt
    updateData.fecha_actualizacion = new Date();


    // 4. Resolver Categoría
    if (categoria) {
      const categoriaRecord = await db.categorias.findUnique({
        where: { nombre: categoria.toLowerCase() },
      });
      if (!categoriaRecord) {
        return {
          success: false,
          message: `La categoría "${categoria}" no existe`,
        };
      }
      updateData.id_categoria = categoriaRecord.id_categoria;
    }

    // 5. Preparar actualización de Stock (anidada)
    const stockUpdatePayload: any = {};
    if (stock !== undefined) {
      stockUpdatePayload.cantidad = stock;
    }

    // 6. CORRECCIÓN CLAVE: Usar las variables correctas
    if (stock_minimo !== undefined) {
      // 'cantidad_min' es el nombre del campo en tu BD (según tu 2da imagen)
      // 'stock_minimo' es la variable que viene de validatedData
      stockUpdatePayload.cantidad_min = stock_minimo;
    }

    // 7. Lógica del upsert (Solo si hay algo que actualizar en stock)
    if (Object.keys(stockUpdatePayload).length > 0) {
      updateData.stock = {
        upsert: {
          where: { id_producto: id_producto },
          update: stockUpdatePayload,
          create: stockUpdatePayload,
        },
      };
    }

    // 8. Ejecutar la transacción (una sola llamada a la BD)
    const updatedProduct = await db.productos.update({
      where: { id_producto: id_producto },
      data: updateData,
      include: {
        stock: true,
        marcas: true,
        categoria: true,
      },
    });

    return {
      success: true,
      message: "Producto actualizado correctamente",
      product: serializePrismaObject(updatedProduct),
    };
  } catch (err: any) {
    if (err instanceof z.ZodError) { // Manejo de ZodError
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