import { z, object, string, ZodObject } from "zod"
 
// Actualizar producto
export const updateProductSchema = z.object({
  id_producto: z.number().int().positive("ID de producto inválido"),
  nombre: z.string().min(1, "El nombre es requerido").optional(),
  codigo_barra: z.union([z.bigint(), z.string().regex(/^\d+$/, "Código de barras inválido")]).optional(),
  precio: z.number().positive("El precio debe ser mayor a 0").optional(),
  stock: z.number().int().nonnegative("El stock no puede ser negativo").optional(),
  categoria: z.string().min(1, "La categoría es requerida").optional(),
  images: z.string().optional(),
  id_proveedor: z.number().int().positive("ID de proveedor inválido").optional(),
  id_marca: z.number().int().positive("ID de marca inválido").optional(),
  fecha_actualizacion: z.date().optional(),
});

// Crear producto
export const createProductSchema = z.object({
  nombre: z.string().min(1, "Nombre es requerido"),
  codigo_barra: z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") return BigInt(val);
    return val;
  }, z.bigint()),
  precio: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categoria: z.preprocess((val) => {
    if (typeof val === "string") return val.trim().toLowerCase();
    return val;
  }, z.string().min(1, "Categoria es requerida")),
  images: z.string().optional().default(""),
  fecha_creacion: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional().default(new Date()),
  fecha_actualizacion: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional().default(new Date()),
  id_proveedor: z.number().int().positive(),
  id_marca: z.number().int().positive().optional(),
});

// Eliminar producto
export const delProductSchema = object({
  name: string({ required_error: "Se necesita un nombre" })
    .min(1, "No puede estar vacío")
    .max(32, "El nombre debe tener menos de 32 caracteres")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/,
      "El nombre no puede contener caracteres especiales"
    ),
});