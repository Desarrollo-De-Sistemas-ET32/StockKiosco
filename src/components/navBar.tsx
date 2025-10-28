// src/components/navBar.tsx
"use client";

import * as React from "react";
import RequireAuth from "@/components/requireAuth";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { BiHomeAlt, BiBox, BiDetail, BiCog } from "react-icons/bi";
import Icono from "./avatarb";

type Props = {

  protect?: boolean;
};

export function NavBar({ protect = true }: Props) {
  const content = (
    <div className="w-full flex justify-center text-sm text-muted-foreground">
      <NavigationMenu className="flex p-4 flex-col rounded-lg shadow-md bg-var6 dark:bg-var2 gap-10 items-center w-full sm:w-[15vh] sm:flex-row px-15">
        <Icono />
        <NavigationMenuLink
          className="flex justify-center items-center flex-row dark:hover:text-shadow-md dark:hover:text-shadow-var7 hover:text-shadow-md hover:text-shadow-var3/75"
          href="/main"
        >
          <BiHomeAlt className="size-4" />
          Página Principal
        </NavigationMenuLink>
        <NavigationMenuLink
          className="flex justify-center items-center flex-row text-foreground dark:hover:text-shadow-md dark:hover:text-shadow-var7 hover:text-shadow-md hover:text-shadow-var3/75 "
          href="/inventory"
        >
          <BiBox className="size-4 text-foreground" />
          Inventario
        </NavigationMenuLink>
        <NavigationMenuLink
          className="flex justify-center items-center flex-row text-foreground dark:hover:text-shadow-md dark:hover:text-shadow-var7 hover:text-shadow-md hover:text-shadow-var3/75 "
          href="/logs"
        >
          <BiDetail className="size-4 text-foreground" />
          Registros
        </NavigationMenuLink>
        <NavigationMenuLink
          className="flex justify-center items-center flex-row text-foreground dark:hover:text-shadow-md dark:hover:text-shadow-var7 hover:text-shadow-md hover:text-shadow-var3/75 "
          href="/manage"
        >
          <BiCog className="size-4 text-foreground" />
          Gestión
        </NavigationMenuLink>
      </NavigationMenu>
    </div>
  );

  return protect ? <RequireAuth>{content}</RequireAuth> : content;
}

export default NavBar;
