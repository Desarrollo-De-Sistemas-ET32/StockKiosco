import db from "@/lib/db";
import { loginSchema } from "@/schemas/login_scheme"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const authConfig = {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Credenciales inválidas: Formato incorrecto.");
        }

        const user = await db.usuarios.findUnique({
          where: {
            email: data.email,
          },
        });

        if (!user) {
          return null;
        }

        if (!user.password) {
            return null;
        }

        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) {
          return null;
        }

        return {
          id: user.id_usuario.toString(),
          name: user.name,
          email: user.email,
          role: user.usuarios_roles,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;

export default authConfig;