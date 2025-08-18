"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar } from "@/components/ui/avatar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "./ui/button"
import { SlLogout } from "react-icons/sl"
import { Menu } from "lucide-react"

// Datos mockeados
const mail = "castro.benjamin@gmail.com"
const placeholder = "BC"
const nombre = "Benjamin Castro"

export function NavigationMenuDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <nav className="mx-auto mt-4 py-5 flex justify-center gap-x-6 items-center w-full px-4">
      {/* Avatar con Popover */}
      <Popover>
        <PopoverTrigger><Avatar>{placeholder}</Avatar></PopoverTrigger>
        <PopoverContent className="bg-foreground text-background text-sm mt-2">
          <p>{mail}</p>
          <Avatar className="bg-card align-middle hover:bg-card">{placeholder}</Avatar>
          <p className="text-lg p-1 border-b border-accent">{nombre}</p>
          <Button>Log Out <SlLogout /></Button>
        </PopoverContent>
      </Popover>

      {/* Menú escritorio */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="flex gap-4">
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

      {/* Botón hamburguesa (solo en móvil) */}
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
      >
        <Menu size={28} />
      </button>

      {/* Menú móvil desplegable */}
      {open && (
        <div className="absolute top-16 right-4 bg-foreground text-background rounded-xl shadow-lg flex flex-col p-4 gap-2 md:hidden">
          <Link href="/homePage">Página Principal</Link>
          <Link href="/statsPage">Estadísticas</Link>
          <Link href="/confPage">Configuración</Link>
          <Link href="/registerPage">Registros</Link>
        </div>
      )}
    </nav>
  )
}