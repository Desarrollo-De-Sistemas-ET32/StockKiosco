import { z, object, string } from "zod";

// Actualizar categoría de producto
export const updateCategoriaSchema = z.object({
  id_producto: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de producto inválido")),
  id_categoria: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de categoría inválido")),
});

// Crear categoría
export const createCategoriaSchema = z.object({
  nombre: z.preprocess((val) => {
    if (typeof val === "string") return val.trim().toLowerCase();
    return val;
  }, z.string().min(1, "Nombre de categoría es requerido")
    .max(50, "El nombre debe tener menos de 50 caracteres")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/,
      "El nombre no puede contener caracteres especiales"
    )),
  descripcion: z.string()
    .max(255, "La descripción debe tener menos de 255 caracteres")
    .optional(),
  fecha_creacion: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional().default(new Date()),
  fecha_actualizacion: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional().default(new Date()),
});

// Actualizar categoría completa
export const updateCategoriaCompletaSchema = z.object({
  id_categoria: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de categoría inválido")),
  nombre: z.preprocess((val) => {
    if (typeof val === "string") return val.trim().toLowerCase();
    return val;
  }, z.string().min(1, "Nombre de categoría es requerido")
    .max(50, "El nombre debe tener menos de 50 caracteres")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/,
      "El nombre no puede contener caracteres especiales"
    )).optional(),
  descripcion: z.string()
    .max(255, "La descripción debe tener menos de 255 caracteres")
    .optional(),
  fecha_actualizacion: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional(),
});

// Eliminar categoría
export const delCategoriaSchema = object({
  nombre: string({ required_error: "Se necesita un nombre" })
    .min(1, "No puede estar vacío")
    .max(50, "El nombre debe tener menos de 50 caracteres")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/,
      "El nombre no puede contener caracteres especiales"
    ),
});

// Buscar categoría por ID
export const getCategoriaByIdSchema = z.object({
  id_categoria: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de categoría inválido")),
});

// Buscar categoría por nombre
export const getCategoriaByNombreSchema = z.object({
  nombre: z.preprocess((val) => {
    if (typeof val === "string") return val.trim().toLowerCase();
    return val;
  }, z.string().min(1, "Nombre de categoría es requerido")
    .max(50, "El nombre debe tener menos de 50 caracteres")),
});