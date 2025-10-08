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
    <div className="w-full flex justify-center text-sm text-muted-foreground">
      <NavigationMenu className="flex p-4 flex-col rounded-lg shadow-md bg-var6 dark:bg-var2 gap-10 items-center w-full sm:w-[15vh] sm:flex-row px-15">
        <Icono src="/PrincessCard.png"></Icono>
        <NavigationMenuLink
          className="flex justify-center items-center flex-row text-foreground"
          href="/main"
        >
          <BiHomeAlt className="size-4 text-foreground" />
          Página Principal
        </NavigationMenuLink>
        <NavigationMenuLink
          className="flex justify-center items-center flex-row text-foreground"
          href="/inventory"
        >
          <BiBox className="size-4 text-foreground" />
          Inventario
        </NavigationMenuLink>
        <NavigationMenuLink
          className="flex justify-center items-center flex-row text-foreground"
          href="/registro"
        >
          <BiDetail className="size-4 text-foreground" />
          Registro
        </NavigationMenuLink>
      </NavigationMenu>
    </div>
  );
}
