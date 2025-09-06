import { z, object, string, ZodObject } from "zod"
export const createDiscountSchema = object({
  id_descuento: z.number().int().positive(),
  nombre: z.string().min(1, "Nombre es requerido"),
  descripcion: z.string().optional().default(""),
  tipo: z.enum(["PORCENTAJE", "MONTOFIJO"]),
  valor: z.number().int().positive(),
  fecha_inicio: z.date().optional().default(new Date()),
  fecha_fin: z.date().optional().nullable().default(null),
})