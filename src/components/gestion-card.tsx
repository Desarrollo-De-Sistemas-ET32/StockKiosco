// components/gestion-card.tsx
'use client'

import React from 'react'
import { 
  BiEditAlt,
  BiTrash
 } from "react-icons/bi";

type Proveedor = {
  id?: number | string
  nombre: string
  telefono?: string
  cuil?: string
  onEdit?: (id?: number | string) => void
  onDelete?: (id?: number | string) => void
}

export default function CardProveedor({ id, nombre, telefono, cuil, onEdit, onDelete }: Proveedor) {
  return (
    <div
      className="card-proveedor flex-none w-full h-16 box-border overflow-hidden bg-light-30 rounded-md shadow-sm flex items-center justify-between px-4 dark:bg-dark-30"
    >
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-gray-800 truncate leading-tight m-0 dark:text-white">
          {nombre}
        </h2>
        {telefono && <div className="text-sm text-muted-foreground truncate">{telefono}</div>}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <button
          onClick={() => onEdit?.(id)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md
                     whitespace-nowrap cursor-pointer"
          title="Editar"
          type="button"
        >
          <BiEditAlt size={14} />
          <span className="hidden sm:inline">Editar</span>
        </button>

        <button
          onClick={() => onDelete?.(id)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-red-500 text-white rounded-md
                     whitespace-nowrap cursor-pointer"
          title="Borrar"
          type="button"
        >
          <BiTrash size={14} />
          <span className="hidden sm:inline">Borrar</span>
        </button>
      </div>
    </div>
  )
}
