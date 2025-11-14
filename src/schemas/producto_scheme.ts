import { z, object, string } from "zod";

// Schema para actualizar un producto
export const updateProductSchema = z.object({
  id_producto: z.number().int().positive("ID de producto inválido"),
  nombre: z.string().min(1, "El nombre es requerido").optional(),
  codigo_barra: z
    .union([
      z.bigint(),
      z
        .string()
        .regex(/^\d+$/, "Código de barras inválido")
        .transform((val) => BigInt(val)),
    ])
    .optional(),
  precio: z.number().positive("El precio debe ser mayor a 0").optional(),
  stock: z.number().int().nonnegative("El stock no puede ser negativo").optional(),
  stock_minimo: z
    .number()
    .int()
    .nonnegative("La cantidad mínima no puede ser negativa")
    .optional(),
  id_categoria: z.number().int().positive("La categoría es inválida").nullable().optional(),
  id_marca: z.number().int().positive("La marca es inválida").nullable().optional(),
  images: z.string().optional(),
  id_proveedor: z.number().int().positive("ID de proveedor inválido").optional(),
  fecha_actualizacion: z.date().optional(),
});

// Schema para crear un producto
export const createProductSchema = z.object({
  nombre: z.string().min(1, "Nombre es requerido"),
  codigo_barra: z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") return BigInt(val);
    return val;
  }, z.bigint()),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  stock: z.number().int().nonnegative("Stock no puede ser negativo"),
  stock_minimo: z.number().int().nonnegative("Stock mínimo no puede ser negativo"),
  id_categoria: z.number().int().positive("Categoría inválida").nullable(),
  id_marca: z.number().int().positive("Marca inválida").nullable(),
  images: z.string().optional().default(""),
  id_proveedor: z.number().int().positive("ID de proveedor inválido"),
  fecha_creacion: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional().default(new Date()),
  fecha_actualizacion: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional().default(new Date()),
});

// Schema para eliminar producto
export const delProductSchema = object({
  name: string({ required_error: "Se necesita un nombre" })
    .min(1, "No puede estar vacío")
    .max(32, "El nombre debe tener menos de 32 caracteres")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/,
      "El nombre no puede contener caracteres especiales"
    ),
});

// Schema para leer producto
export const readProductSchema = z.object({
  id_producto: z
    .preprocess((val) => {
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    }, z.number().int().positive("ID de producto inválido"))
    .optional(),
  nombre: z
    .preprocess((val) => {
      if (typeof val === "string") return val.trim().toLowerCase();
      return val;
    }, z.string().min(1, "El nombre no puede estar vacío"))
    .optional(),
  id_categoria: z
    .preprocess((val) => {
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    }, z.number().int().positive("Categoría inválida"))
    .nullable()
    .optional(),
  id_proveedor: z
    .preprocess((val) => {
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    }, z.number().int().positive("ID de proveedor inválido"))
    .optional(),
  id_marca: z
    .preprocess((val) => {
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    }, z.number().int().positive("ID de marca inválido"))
    .nullable()
    .optional(),
  stock_min: z
    .preprocess((val) => {
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    }, z.number().int().nonnegative("Stock mínimo inválido"))
    .optional(),
  stock_max: z
    .preprocess((val) => {
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    }, z.number().int().nonnegative("Stock máximo inválido"))
    .optional(),
  precio_min: z.number().positive("Precio mínimo inválido").optional(),
  precio_max: z.number().positive("Precio máximo inválido").optional(),
  activo: z.boolean().optional(),
});