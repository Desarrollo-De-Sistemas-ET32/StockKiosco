"use server";
import { db } from "@/lib/db";

type CreateProductValues = {
  nombre: string;
  precio: string;
  codigo_barra: number;
  fecha_actualizacion: Date;
  proveedores: { connect: { id_proveedor: number } }; // 🔧 CORREGIDO
};

export const createProduct = async (values: CreateProductValues) => {
  try {
    const product = await db.productos.create({
      data: {
        nombre: values.nombre,
        precio: values.precio,
        codigo_barra: values.codigo_barra,
        fecha_actualizacion: values.fecha_actualizacion,
        proveedores: values.proveedores,
      },
    });
    return { product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Error creating product" };
  }
};
