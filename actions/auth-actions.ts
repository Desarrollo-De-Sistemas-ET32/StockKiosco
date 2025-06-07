"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/zod";
import z3 from "zod";

export const loginAction=async(values: z3.infer<typeof loginSchema>) => {

try {
    await signIn("credentials",{
      email:values.email,
      password:values.password,
      redirect:false,
    })    
} catch (error) {
    console.log(error)
}

}