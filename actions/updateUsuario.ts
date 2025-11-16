'use server'
import db from "@/lib/db";
import bcrypt from "bcryptjs"; 

type ModifyUser = {
  emailOriginal: string,
  nombre: string,
  emailNuevo: string,
  password: string
}

export const editUser = async (values: ModifyUser) => {
  try {
    const hashedPassword = await bcrypt.hash(values.password, 10); 

    const dataToUpdate: any = {
      name: values.nombre,
      password: hashedPassword
    };

    if (values.emailNuevo && values.emailNuevo.trim() !== "") {
      dataToUpdate.email = values.emailNuevo;
    }

    await db.usuarios.update({
      where: { email: values.emailOriginal },
      data: dataToUpdate,
    });

    return { success: true, message: "Se han actualizado los datos." };
  } catch (error) {
    console.error("Error modifying user:", error);
    return { error: "Error al modificar el usuario." };
  }
}

