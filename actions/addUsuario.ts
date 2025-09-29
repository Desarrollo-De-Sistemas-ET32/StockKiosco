// app/actions/createUsuario.ts
"use server";
import db from "@/lib/db";

type CreateUsuarioValues = {
  name: string;
  email: string;
  password: string;
  telefono?: string | null;
  direccion?: string | null;
  usuarios_roles?: string[]; // si el modelo no lo soporta, será ignorado al crear
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
};

export const createUsuario = async (values: CreateUsuarioValues) => {
  if (!values.name || typeof values.name !== "string")
    return { error: "El nombre del usuario es obligatorio." };
  if (!values.email || typeof values.email !== "string")
    return { error: "El email del usuario es obligatorio." };
  if (!values.password || typeof values.password !== "string")
    return { error: "La contraseña es obligatoria." };

  try {
    const existe = await db.usuarios.findUnique({
      where: { email: values.email },
      select: { id_usuario: true },
    });
    if (existe) return { error: "El email ya está registrado." };

    // Lista blanca de campos que sabemos que existen en el modelo (evita Unknown argument)
    const allowedFields = [
      "name",
      "email",
      "password",
      "fecha_creacion",
      "fecha_actualizacion",
      // Si tu schema tiene otros campos válidos agregalos aquí.
    ] as const;

    const dataToCreate: any = {};

    if (allowedFields.includes("name")) dataToCreate.name = values.name;
    if (allowedFields.includes("email")) dataToCreate.email = values.email;
    if (allowedFields.includes("password")) dataToCreate.password = values.password;
    dataToCreate.fecha_creacion = values.fecha_creacion ?? new Date();
    dataToCreate.fecha_actualizacion = values.fecha_actualizacion ?? new Date();

    const usuario = await db.usuarios.create({
      data: dataToCreate,
    });

    // Informar si el request traía campos extra que no se guardaron
    const ignored: Record<string, any> = {};
    if (values.telefono) ignored.telefono = values.telefono;
    if (values.direccion) ignored.direccion = values.direccion;
    if (values.usuarios_roles) ignored.usuarios_roles = values.usuarios_roles;

    return { success: true, usuario, ignored: Object.keys(ignored).length ? ignored : undefined };
  } catch (error) {
    console.error("createUsuario error:", error);
    return { error: "Error al crear usuario" };
  }
};
