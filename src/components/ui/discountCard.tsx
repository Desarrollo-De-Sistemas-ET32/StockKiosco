"use client"

import * as React from "react"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface DescuentoCardProps {
  id_descuento: number;
  nombre: string;
  tipo: string;
  valor: number;
  descripcion?: string;
  activo: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  className?: string;
  sortBy: "nombre" | "valor" | "fecha_inicio";
  sortOrder: "asc" | "desc";
  searchTerm?: string;
}

export function ProductCard({
  className,
  id_descuento,
  nombre,
  tipo,
  valor,
  descripcion,
  activo,
  fecha_inicio,
  fecha_fin,
}: DescuentoCardProps) {
  return (
    <li className={`bg-card text-card-foreground w-full p-4 flex flex-col gap-2 rounded-md font-medium ${className ?? ""}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">{nombre}</h3>
        <span className={`px-2 py-1 rounded text-sm font-semibold ${activo ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {activo ? "Activo" : "Inactivo"}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">{descripcion ?? "Sin descripción"}</p>

      <div className="flex justify-between text-sm text-muted-foreground">
        <div>
          {/* <p><strong>ID:</strong> {id_descuento}</p> */}
          <p><strong>Tipo:</strong> {tipo}</p>
        </div>
        <div className="text-right">
          {tipo === "PORCENTAJE" ? (
            <p><strong>Valor: </strong>{valor}%</p>
          ) : (
            <p><strong>Valor: </strong>${valor.toFixed(2)}</p>
          )}
          <p><strong>Vigencia: </strong> {new Date(fecha_inicio).toLocaleDateString()} - {new Date(fecha_fin).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <Button variant="filled" size="lg">
          <Link href={`/editProduct/${id_descuento}`}>Editar</Link>
        </Button>
        <Button size="lg" variant="default">Eliminar</Button>
      </div>
    </li>
  );
}
