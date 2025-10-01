"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { filterUser } from "@/actions/filtrarUsuario"

export function FilterUsers() {
  const [position, setPosition] = React.useState("bottom")

  const handleFilter = async (value: string) => {
    window.alert(`Filtrando por: ${value}`)
    const filtering = window.prompt("Ingrese el valor para filtrar:")
    if (!filtering) {
      window.alert("No se proporcionó un valor para filtrar.")
    }
    const result = await filterUser({ [value]: filtering })
    console.log(result)
  }

  const handleValueSelect = (value: string) => {
    setPosition(value)
    handleFilter(value) // Llama a la función de filtrado cuando se selecciona un valor
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Filtrar Usuarios</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filtrar por:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={handleValueSelect}>
          <DropdownMenuRadioItem value="id_usuario">ID</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="nombre" >Nombre</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="email">Email</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="usuario_roles">Roles</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
