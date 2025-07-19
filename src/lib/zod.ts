import z, { object, string } from "zod"
 
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


export const delproveedorSchema = object({
  name: string({ required_error: "Se necesita un nombre" })
    .min(1, "No puede estar vacío")
    .max(32, "El nombre debe tener menos de 32 caracteres")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/,
      "El nombre no puede contener caracteres especiales"
    ),
});

export const actualizarProveedorSchema = z.object({
  id_proveedor: z.number().int().positive(),
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre es muy largo")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/, "El nombre contiene caracteres no permitidos"),
  contacto: z
    .string()
    .min(1, "El contacto no puede estar vacío")
    .max(100, "El contacto es muy largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, "El contacto contiene caracteres no permitidos"),
  telefono: z
    .string()
    .min(7, "Teléfono muy corto")
    .max(20, "Teléfono muy largo")
    .regex(/^[0-9+\-\s()]+$/, "Teléfono contiene caracteres no permitidos"),
  email: z.string().email("Email inválido"),
  direccion: z
    .string()
    .min(1, "La dirección no puede estar vacía")
    .max(200, "La dirección es muy larga"),
  fecha_actualizacion: z
    .preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date({ required_error: "Fecha inválida" })),
});


export const crearProveedorSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre es muy largo")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/, "El nombre contiene caracteres no permitidos"),
  contacto: z
    .string()
    .min(1, "El contacto no puede estar vacío")
    .max(100, "El contacto es muy largo")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, "El contacto contiene caracteres no permitidos"),
  telefono: z
    .string()
    .min(7, "Teléfono muy corto")
    .max(20, "Teléfono muy largo")
    .regex(/^[0-9+\-\s()]+$/, "Teléfono contiene caracteres no permitidos"),
  email: z.string().email("Email inválido"),
  direccion: z
    .string()
    .min(1, "La dirección no puede estar vacía")
    .max(200, "La dirección es muy larga"),
});
