'use server'
import db from "@/lib/db";
import bcrypt from "bcryptjs"; 

type ModifyUser = {// Define the structure of the values to modify
  emailOriginal: string,
  nombre: string,
  emailNuevo: string,
  password: string
}

export const editUser = async (values: ModifyUser) => {
  try {
    const hashedPassword = await bcrypt.hash(values.password, 10); 

    const dataToUpdate: any = {// Prepare the data to update
      name: values.nombre,
      password: hashedPassword
    };

    if (values.emailNuevo && values.emailNuevo.trim() !== "") {// If a new email is provided, update it
      dataToUpdate.email = values.emailNuevo;
    }

    await db.usuarios.update({// Update the user with the original email
      where: { email: values.emailOriginal },
      data: dataToUpdate,
    });

    return { success: true, message: "Se han actualizado los datos." };
  } catch (error) {
    console.error("Error modifying user:", error);
    return { error: "Error al modificar el usuario." };
  }
}

