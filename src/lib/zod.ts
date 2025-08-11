import { z, object, string, ZodObject } from "zod"
 
export const loginSchema = object({
  email: string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const registerSchema = object({
  email: string()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
    name: string()
    .min(1,"Name is required")
    .max(32, "Password must be less than 32 characters")

})



export const createDiscountSchema = object({
  id_descuento: z.number().int().positive(),
  nombre: z.string().min(1, "Nombre es requerido"),
  descripcion: z.string().optional().default(""),
  tipo: z.enum(["PORCENTAJE", "MONTOFIJO"]),
  valor: z.number().int().positive(),
  fecha_inicio: z.date().optional().default(new Date()),
  fecha_fin: z.date().optional().nullable().default(null),
})