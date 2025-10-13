// components/card.tsx
"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";

type Proveedor = {
  id?: string | number;
  nombre: string;
  telefono?: string;
  cuil?: string;
};

export default function CardProveedor({ nombre }: Proveedor) {
  return (
    <div
      className="card-proveedor flex-none w-full h-16 box-border overflow-hidden bg-white rounded-lg border border-gray-200
                 shadow-sm flex items-center justify-between px-4 dark:bg-var1"
    >
      {/* Nombre: SIN margen, truncate */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-gray-800 truncate leading-tight m-0 dark:text-white">
          {nombre}
        </h2>
      </div>

      {/* Acciones: no hacen wrap, no ocupan más alto */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md
                     whitespace-nowrap"
          title="Editar"
          type="button"
        >
          <Edit2 size={14} />
          <span className="hidden sm:inline">Editar</span>
        </button>

        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-red-500 text-white rounded-md
                     whitespace-nowrap"
          title="Borrar"
          type="button"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Borrar</span>
        </button>
      </div>
    </div>
  );
}