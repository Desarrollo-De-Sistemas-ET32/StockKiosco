"use server";
import db from "@/lib/db";
import { createProductSchema, updateProductSchema } from "@/schemas/producto_scheme";
import { z } from "zod";

export const createProduct = async (values: unknown) => {
  try {
    const validated = createProductSchema.parse(values);

    const product = await db.productos.create({
      data: {
        nombre: validated.nombre,
        codigo_barra: validated.codigo_barra,
        precio: validated.precio,
        id_proveedor: validated.id_proveedor,
        id_categoria: validated.id_categoria,
        id_marca: validated.id_marca,
        images: validated.images,
        fecha_creacion: validated.fecha_creacion,
        fecha_actualizacion: validated.fecha_actualizacion,
        stock: {
          create: {
            cantidad: validated.stock,
            cantidad_min: validated.stock_minimo,
          },
        },
      },
      include: {
        stock: true,
      },
    });

    return { product };
  } catch (error: any) {
    return { error: error?.message ?? "Error creando producto" };
  }
};

export const updateProduct = async (values: unknown) => {
  try {
    const validated = updateProductSchema.parse(values);

    const product = await db.productos.update({
      where: { id_producto: validated.id_producto },
      data: {
        nombre: validated.nombre,
        codigo_barra: validated.codigo_barra,
        precio: validated.precio,
        id_proveedor: validated.id_proveedor,
        id_categoria: validated.id_categoria,
        id_marca: validated.id_marca,
        images: validated.images,
        fecha_actualizacion: validated.fecha_actualizacion ?? new Date(),
      },
      include: { stock: true },
    });


    if (validated.stock !== undefined || validated.stock_minimo !== undefined) {
      await db.stock.updateMany({
        where: { id_producto: validated.id_producto },
        data: {
          cantidad: validated.stock,
          cantidad_min: validated.stock_minimo,
        },
      });
    }

    return { product };
  } catch (error: any) {
    return { error: error?.message ?? "Error actualizando producto" };
  }
};