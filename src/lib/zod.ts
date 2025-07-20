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

export const updateUserSchema = z.object({
  id_proveedor: z.number().int().positive(),
  email: string({ required_error: "Ingrese un email" })
    .min(1, "Ingrese un email")
    .email("Email invalido"),
  name: string({ required_error: "Ingrese un nombre" })
    .min(1, "Ingrese un nombre")
    .max(32, "El nombre debe tener menos de 32 caracteres"),
  password: string({ required_error: "Se necesita una contraseña" })
    .min(1, "Se necesita una contraseña")
    .min(8, "La contraseña debe tener más de 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
  usuario_roles: z.string().optional(),
  fecha_actualizacion: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date({ required_error: "Fecha inválida" }))
});

export const delUserSchema = object({
  nombre: string({ required_error: "Se necesita un nombre" })
    .min(1, "Se necesita un nombre")
    .min(8, "El nombre debe tener más de 8 caracteres")
    .max(32, "El nombre debe tener menos de 32 caracteres")
})