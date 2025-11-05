import z, { object, string } from "zod"

// Eliminar proveedor
export const delproveedorSchema = object({
  name: string({ required_error: "Se necesita un nombre" })
    .min(1, "No puede estar vacío")
    .max(32, "El nombre debe tener menos de 32 caracteres")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/,
      "El nombre no puede contener caracteres especiales"
    ),
});

// Actualizar proveedor
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
});

// Crear proveedor
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

// Leer proveedor (filtros opcionales)
export const readProveedorSchema = z.object({
  id_proveedor: z
    .preprocess((val) => {
      if (typeof val === "string") return parseInt(val, 10);
      return val;
    }, z.number().int().positive("ID de proveedor inválido"))
    .optional(),
  nombre: z
    .preprocess((val) => {
      if (typeof val === "string") return val.trim().toLowerCase();
      return val;
    }, z.string().min(1, "El nombre no puede estar vacío"))
    .optional(),
  contacto: z
    .preprocess((val) => {
      if (typeof val === "string") return val.trim();
      return val;
    }, z.string().min(1, "El contacto no puede estar vacío"))
    .optional(),
  email: z.string().email("Email inválido").optional(),
  activo: z.boolean().optional(),
});
