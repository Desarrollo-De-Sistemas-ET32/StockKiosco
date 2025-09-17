"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { BiHomeAlt, BiBox, BiDetail } from "react-icons/bi";
import Icono from "./avatarb";

export function NavBar() {
  return (
      <NavigationMenu className="flex p-4 flex-col rounded-lg shadow-md bg-var7 dark:bg-var2 gap-10 items-center w-full sm:w-[15vh] sm:flex-row px-15">
        <Icono src="/PrincessCard.png"></Icono>
        <NavigationMenuLink
          className="flex justify-center items-center flex-row hover:bg-var6/80 dark:hover:bg-var1/80 hover:rounded-md"
          href="/main"
        >
          <BiHomeAlt className="size-4" />
          Página Principal
        </NavigationMenuLink>
        <NavigationMenuLink
          className="flex justify-center items-center flex-row hover:bg-var6/80 dark:hover:bg-var1/80 hover:rounded-md"
          href="/inventario"
        >
          <BiBox className="size-4" />
          Inventario
        </NavigationMenuLink>
        <NavigationMenuLink
          className="flex justify-center items-center flex-row hover:bg-var6/80 dark:hover:bg-var1/80 hover:rounded-md"
          href="/registro"
        >
          <BiDetail className="size-4" />
          Registro
        </NavigationMenuLink>
      </NavigationMenu>
  );
}
