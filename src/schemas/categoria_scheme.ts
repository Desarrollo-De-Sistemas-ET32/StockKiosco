
import { z } from "zod";


const nombreValidation = z.preprocess((val) => {
  if (typeof val === "string") return val.trim().toLowerCase();
  return val;
},
z.string()
  .min(1, "El nombre no puede estar vacío")
  .superRefine((nombre, ctx) => {
    if (typeof nombre !== "string" || nombre.length === 0) return;
    if (/\d/.test(nombre)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No se aceptan números en el nombre",
      });
      return;
    }
    const onlyLettersAndSpaces = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    if (!onlyLettersAndSpaces.test(nombre)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El nombre no puede contener caracteres especiales",
      });
    }
  })
);


export const createCategoriaSchema = z.object({
  nombre: nombreValidation
});


export const updateCategoriaSchema = z.object({
  id_categoria: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de categoría inválido")),
  nombre: nombreValidation
});


export const deleteCategoriaSchema = z.object({
  id_categoria: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de categoría inválido")),
});

export const readCategoriaSchema = z.object({
  id_categoria: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de categoría inválido")).optional(),
  nombre: nombreValidation.optional()
});