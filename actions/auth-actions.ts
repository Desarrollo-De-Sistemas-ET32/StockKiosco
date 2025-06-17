"use server";

import { signIn } from "@/auth";
import { loginSchema,registerSchema } from "@/lib/zod";
import{AuthError} from "next-auth"
import z3 from "zod";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export const loginAction=async(values: z3.infer<typeof loginSchema>) => {

try {
    await signIn("credentials",{
      email:values.email,
      password:values.password,
      redirect:false,
    });
    return{success: true};
} catch (error) {
    if (error instanceof AuthError){
      return {error:error.cause?.err?.message};
    }
    return {error:"error 500"};
}

}

export const registerAction = async (values: z3.infer<typeof registerSchema>) => {
  try{

    const {data, success} = registerSchema.safeParse(values);
    if (!success){
      return{
        error: "Invalid data",
      }
    }

    //verificar si el usuario ya existe
const user = await db.usuarios.findUnique({
  where: {
    email: data.email,
  }
});

if (user) {
  return {
    error: "User already exists",
    userId: user.id_usuario,
  };
}


    const passwordHash = await bcrypt.hash(data.password, 10);

    await db.usuarios.create({
      data: {
        name: data.name,
        email: data.email,
        password: passwordHash,
        fecha_actualizacion: new Date(),
      },
    })

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return {success: true};

  }catch(error){
    if(error instanceof AuthError){
      return {error: error.cause?.err?.message};
    }
    return {error: "error 500"};
  }
}
