// src/actions/actualizarProducto.ts
import db from "@/lib/db";

export async function updateProduct(id: number, data: any) {
  try {
    // 1. Validar que el campo 'stock' esté presente
    if (data.stock === undefined || data.stock === null) {
      return { success: false, message: "El campo de stock no puede estar vacío." };
    }

    // 2. Realizar la actualización en la tabla 'stock'
    const updatedStock = await db.stock.update({
        where: {
            id_producto: id, // Ahora Prisma acepta esto como un filtro único
        },
        data: {
            cantidad: Number(data.stock),
        },
    });

    // 3. Opcional: Actualizar el producto con otros campos (si los hay)
    const updatedProduct = await db.productos.update({
      where: {
        id_producto: id,
      },
      data: {
        nombre: data.nombre,
        precio: data.precio,
        codigo_barra: data.codigo_barra,
        // No incluyas el stock aquí
      },
    });

    return {
      success: true,
      message: "Producto y stock actualizados con éxito.",
      body: updatedProduct,
    };
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return {
      success: false,
      message: "Error al actualizar.",
      error: String(error),
    };
  }
}