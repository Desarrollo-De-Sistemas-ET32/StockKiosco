"use client"

import * as React from "react"
import { Button } from "./button";
import { productProps } from "@/types/product"

export function ProductCard({
  id,
  name,
  id_marca,
  codigo_barra,
  price,
  stock,
  className,
  onDelete,
  onEdit,
}: productProps ) {
  
  const handleDelete = () => {
    if (onDelete && window.confirm(`¿Estás seguro de que quieres eliminar ${name}?`)) {
      onDelete(id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id);
    }
  };

  return (
    <li className={`bg-card text-card-foreground w-full p-2 flex items-center gap-6 whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${className}`}>
      <img src="/notFound.png" className="bg-foreground z-50 w-40 h-30 rounded-md border m-4" alt={name}/>
      
      <div className="flex-1">
        <h4 className="text-[26px] font-bold">{name}</h4>
        <p>{id_marca}</p>
        <div className="flex gap-4">
          <p className="text-sm text-muted-foreground">{codigo_barra}</p>
          <p className="text-sm font-medium">${price}</p>
          <p>{stock}</p>
        </div>
      </div>

      <div className="flex gap-7 items-center">
        <Button variant="filled" size="lg" onClick={handleEdit}>
          Editar
        </Button>
        <Button className="mr-10" size="lg" onClick={handleDelete}>
          Eliminar
        </Button>
      </div>
    </li>
  )
}
