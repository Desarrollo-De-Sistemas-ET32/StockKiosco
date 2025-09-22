import { z } from "zod";

export const createDiscountSchema = z.object({
  id_descuento: z.number().int().positive(),
  nombre: z.string().min(1, "Nombre es requerido"),
  descripcion: z.string().optional().default(""),
  tipo: z.enum(["PORCENTAJE", "MONTOFIJO"]),
  valor: z.number().int().positive(),
  fecha_inicio: z.string().optional().default(new Date().toISOString()),
  fecha_fin: z.string().optional().nullable().default(null),
  activo: z.boolean().optional().default(true),
});

export const updateDescuentoSchema = z.object({
  id_descuento: z.number({ required_error: "El ID del descuento es obligatorio" }).int(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  tipo: z.enum(["PORCENTAJE", "MONTOFIJO"]).optional(),
  valor: z.number().int().optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional().nullable(),
  fecha_actualizacion: z.string().optional().default(new Date().toISOString()),
  activo: z.boolean().optional(),
});

export const deleteDescuentoSchema = z.object({
  id_descuento: z.number({ required_error: "El ID del descuento es obligatorio" }).int(),
});

export type DeleteDescuentoInput = z.infer<typeof deleteDescuentoSchema>;
export type UpdateDescuentoInput = z.infer<typeof updateDescuentoSchema>;
