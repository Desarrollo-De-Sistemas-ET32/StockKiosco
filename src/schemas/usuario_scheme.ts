import { z, object, string } from "zod";

// Eliminar usuario
export const delUserSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

// Actualizar usuario
export const updateUserSchema = object({
  email: string({ required_error: "Se necesita un email" }),
  nombre: string({ required_error: "Se necesita un nombre" }),
  telefono: string().optional().default(""),
  direccion: string().optional().default(""),
  fecha_actualizacion: z.date().optional().default(new Date()),
});

// Crear usuario
export const crearUsuarioSchema = object({
  name: string().optional(),
  nombre: string().optional(),
  email: string({ required_error: "Se necesita un email" })
    .min(1, "Se necesita un email")
    .email("Email inválido"),
  password: string({ required_error: "Se necesita una contraseña" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(64, "La contraseña debe tener menos de 64 caracteres"),
  telefono: string().optional().default(""),
  direccion: string().optional().default(""),
  usuarios_roles: z.array(z.string()).optional().default(["user"]),
});

// Leer usuario (filtros opcionales)
export const readUserSchema = object({
  email: string().email("Email inválido").optional(),
  nombre: z
    .preprocess((val) => {
      if (typeof val === "string") return val.trim().toLowerCase();
      return val;
    }, z.string().min(1, "El nombre no puede estar vacío"))
    .optional(),
  telefono: string().optional(),
  direccion: string().optional(),
  usuarios_roles: z.array(z.string()).optional(),
  activo: z.boolean().optional(),
});
