// next-auth.d.ts
import { rolesUser } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: rolesUser | null; 

    } & DefaultSession["user"];
  }

    interface User {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: rolesUser | null; 

    }
}