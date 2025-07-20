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

// Actualizar producto

export const updateProductSchema: ZodObject<{
  id_producto: z.ZodNumber,
  data: z.ZodObject<{
    id_producto: z.ZodNumber,
    id_marca: z.ZodNumber,
    id_proveedor: z.ZodNumber,
    nombre: z.ZodString,
    codigo_barra: z.ZodNumber,
    precio: z.ZodNumber,
    fecha_actualizacion: z.ZodDate,
  }>
}> = object({
  id_producto: z.number().int().positive(),
  data: object({
    id_producto: z.number().int().positive(),
    id_marca: z.number().int().positive(),
    id_proveedor: z.number().int().positive(),
    nombre: z.string().min(1, "Nombre es requerido"),
    codigo_barra: z.number().int().positive(),
    precio: z.number().positive(),
    fecha_actualizacion: z.date(),
  })
});

// Crear producto

export const createProductSchema: ZodObject<{
  data: z.ZodObject<{
    id_marca: z.ZodNumber,
    id_proveedor: z.ZodNumber,
    nombre: z.ZodString,
    codigo_barra: z.ZodNumber,
    precio: z.ZodNumber,
    fecha_creacion: z.ZodDate,
  }>
}> = object({
  data: object({
    id_marca: z.number().int().positive(),
    id_proveedor: z.number().int().positive(),
    nombre: z.string().min(1, "Nombre es requerido"),
    codigo_barra: z.number().int().positive(),
    precio: z.number().positive(),
    fecha_creacion: z.date(),
  })
});

// Eliminar producto

export const deleteProductSchema: ZodObject<{
  id_producto: z.ZodNumber,
}> = object({
  id_producto: z.number().int().positive(),
}); 

export const getProductSchema: ZodObject<{
  id_producto: z.ZodNumber,
}> = object({
  id_producto: z.number().int().positive(),
});

// Obtener productos

export const getProductsSchema: ZodObject<{
  page: z.ZodNumber,
  limit: z.ZodNumber,
}> = object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

export const getProductsByBrandSchema: ZodObject<{
  id_marca: z.ZodNumber,
}> = object({
  id_marca: z.number().int().positive(),
});

export const getProductsByProviderSchema: ZodObject<{
  id_proveedor: z.ZodNumber,
}> = object({
  id_proveedor: z.number().int().positive(),
});

export const getProductsByNameSchema: ZodObject<{
  nombre: z.ZodString,
}> = object({
  nombre: z.string().min(1, "Nombre es requerido"),
});

export const getProductsByBarcodeSchema: ZodObject<{
  codigo_barra: z.ZodNumber,
}> = object({
  codigo_barra: z.number().int().positive(),
});

export const getProductsByPriceRangeSchema: ZodObject<{
  min_price: z.ZodNumber,
  max_price: z.ZodNumber,
}> = object({
  min_price: z.number().int().positive(),
  max_price: z.number().int().positive(),
});

export const getProductsByDateRangeSchema: ZodObject<{
  start_date: z.ZodDate,
  end_date: z.ZodDate,
}> = object({
  start_date: z.date(),
  end_date: z.date(),
});

