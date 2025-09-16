"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import { Avatar } from "./ui/avatar"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Button } from "./ui/button"
import { SlLogout } from "react-icons/sl"

//fix
const mail = "castro.benjamin@gmail.com"
const placeholder = "BC";//acá en realidad toma las iniciales del primer ombre y primer apellido del usuario actual
const nombre = "Benjamin" + " " + "Castro";


export function NavigationMenuDemo() {
    return (
    <NavigationMenu viewport={false} className="mx-auto">
      <NavigationMenuList className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        <Popover> 
          <PopoverTrigger><Avatar>{placeholder}</Avatar></PopoverTrigger>
          <PopoverContent className="bg-foreground text-background text-sm mt-2">
            <p>{mail}</p>
            <Avatar className="bg-card align-middle hover:bg-card">{placeholder}</Avatar>
            <p className="text-lg p-1 border-b-1 border-accent">{nombre}</p>
            <Button>Log Out <SlLogout /></Button>
          </PopoverContent>
        </Popover>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/homePage">Página Principal</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/statsPage">Estadísticas</Link> 
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/confPage">Configuración</Link> 
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/registerPage">Registros</Link> 
          </NavigationMenuLink>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  )
}
