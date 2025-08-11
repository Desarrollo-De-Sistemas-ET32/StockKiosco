"use client"

import * as React from "react"
import { ProductCard } from "@/components/ui/productCard"
import { useEffect, useState } from "react";

type Descuento = {
  id_descuento: number;
  tipo: string;
  valor: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
  descripcion?: string;
  fecha_fin: string;
  fecha_inicio: string;
  nombre: string;
};

export function DescuentoList() {
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDescuentos() {
      try {
        const res = await fetch("/api/descuento/consultaDescuento");
        const json = await res.json();

        if (json.success) {
          setDescuentos(json.data || []);
        } else {
          console.error("Error en API:", json.message);
          setDescuentos([]);
        }
      } catch (error) {
        console.error("Error fetching discounts:", error);
        setDescuentos([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDescuentos();
  }, []);

  if (isLoading) {
    return (
      <ul className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <ProductCard
            key={`loading-${i}`}
            id_descuento={0}
            nombre="Loading"
            tipo="Loading"
            valor={0}
            activo={false}
            fecha_inicio={new Date().toISOString()}
            fecha_fin={new Date().toISOString()}
            descripcion=""
            className="opacity-50"
          />
        ))}
      </ul>
    )
  }

  return (
    <ul className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
      {descuentos.map((desc) => (
        <ProductCard
          key={desc.id_descuento}
          id_descuento={desc.id_descuento}
          nombre={desc.nombre}
          tipo={desc.tipo}
          valor={Number(desc.valor)}
          activo={desc.activo}
          fecha_inicio={desc.fecha_inicio}
          fecha_fin={desc.fecha_fin}
          descripcion={desc.descripcion}
        />
      ))}
    </ul>
  )
}
