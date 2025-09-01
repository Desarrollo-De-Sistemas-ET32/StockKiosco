import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "@/auth.config"
import { PrismaClient } from "@prisma/client/scripts/default-index.js"
import db from "@/lib/db";
import { Prisma, rolesUser } from "@prisma/client";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {

    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.usuarios_roles = user.role;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.usuarios_roles as rolesUser | null; // Asegúrate de que el tipo coincida con tu modelo Prisma

      }
      return session;
    },
  },

  },
);
