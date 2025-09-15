//src/schemas/caegoria_scheme.ts
import { z } from "zod";

export const updateCategoriaSchema = z.object({
  id_categoria: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int().positive("ID de categoría inválido")),
  nombre: z.preprocess((val) => {
    if (typeof val === "string") return val.trim().toLowerCase();
    return val;
  },
  z.string()
    .min(1, "El nombre no puede estar vacio")
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
  )
});

