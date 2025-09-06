import { z, object, string, ZodObject } from "zod"
 
// Actualizar producto

export const updateProductSchema = z.object({
  id_producto: z.number().int().positive(),
  nombre: z.string().min(1, "Nombre es requerido"),
  descripcion: z.string().optional().default(""),
  precio: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  categoria: z.string().min(1, "Categoria es requerida"),
  imagen: z.string().optional().default(""),
  fecha_creacion: z.date().optional().default(new Date()),
  fecha_actualizacion: z.date().optional().default(new Date()),
  id_proveedor: z.number().int().positive().optional(),
  id_categoria: z.number().int().positive().optional()
})

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