import { z } from "zod"

export const detalleVentaSchema = z.object({
  id_producto: z
    .number({ required_error: "El ID del producto es obligatorio." })
    .int("El ID del producto debe ser un número entero.")
    .positive("El ID del producto debe ser positivo."),
  cantidad: z
    .number({ required_error: "La cantidad es obligatoria." })
    .int("La cantidad debe ser un número entero.")
    .positive("La cantidad debe ser mayor a 0."),
})

export const nuevaVentaSchema = z.object({
  id_usuario: z
    .union([
      z.number().int(),
      z.string().regex(/^\d+$/, "El ID del usuario debe ser numérico."),
    ])
    .transform((v) => Number(v)),
  
  detalles: z
    .array(detalleVentaSchema)
    .min(1, "Debe haber al menos un detalle en la venta."),

  pagado: z.boolean().optional(),

  id_descuento: z
    .union([
      z.number().int().positive(),
      z.string().regex(/^\d+$/),
      z.null(),
    ])
    .optional()
    .transform((v) => (v == null ? null : Number(v))),
})

export type NuevaVentaInput = z.infer<typeof nuevaVentaSchema>
