// app/actions/createUsuario.ts
"use server";
import db from "@/lib/db";

type CreateUsuarioValues = {
  id_usuario?: number;
  name: string;
  email: string;
  password: string; // se asume hasheada si la route la hizo
  telefono?: string;
  direccion?: string;
  usuarios_roles?: string[];
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

    const usuario = await db.usuarios.create({
      data: {
        name: values.name,
        email: values.email,
        password: values.password,
        telefono: values.telefono ?? "",
        direccion: values.direccion ?? "",
        usuarios_roles: values.usuarios_roles ?? ["user"],
        fecha_creacion: values.fecha_creacion ?? new Date(),
        fecha_actualizacion: values.fecha_actualizacion ?? new Date(),
      },
    });

    return { success: true, usuario };
  } catch (error) {
    console.error("createUsuario error:", error);
    return { error: "Error al crear usuario" };
  }
};
