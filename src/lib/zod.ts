import { z, object, string, ZodObject } from "zod"
 
export const loginSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const registerSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
    name: string({required_error:"Name is not valid"})
    .min(1,"Name is required")
    .max(32, "Password must be less than 32 characters")

})
// Borrar usuario

export const delUserSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

// Actualizar usuario

export const updateUserSchema = object({
  email: string({required_error: "Se necesita un email"}),
  nombre: string({required_error: "Se necesita un nombre"}),
  telefono: string().optional().default(""),
  direccion: string().optional().default(""),
  fecha_actualizacion: z.date().optional().default(new Date())
})