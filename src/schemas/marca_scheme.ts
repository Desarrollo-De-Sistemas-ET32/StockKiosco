import {z} from "zod";

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

export const createMarcaSchema = z.object({
  nombre: nombreValidation
});

export const updateMarcaSchema = z.object({
  id_marca: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de marca inválido")),
  nombre: nombreValidation
});

export const deleteMarcaSchema = z.object({
  id_marca: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de marca inválido")),
});

export const readMarcaSchema = z.object({
  id_marca: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de marca inválido")).optional(),
  nombre: nombreValidation.optional()
});