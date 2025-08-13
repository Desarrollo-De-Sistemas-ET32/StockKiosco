import { useState, useEffect } from "react";
import { ProductCard } from "./ui/discountCard";

interface Descuento {
  id_descuento: number;
  nombre: string;
  tipo: string;
  valor: number | string;
  activo: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string;
}

export function DescuentoList({
  sortBy,
  sortOrder,
  searchTerm = "",
}: {
  sortBy: "nombre" | "valor" | "fecha_inicio";
  sortOrder: "asc" | "desc";
  searchTerm?: string;
}) {
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

  // 🔹 Filtrar por nombre
  const filteredDescuentos = descuentos.filter((desc) =>
    desc.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Ordenar después de filtrar
  const sortedDescuentos = [...filteredDescuentos].sort((a, b) => {
    let valueA: string | number = a[sortBy];
    let valueB: string | number = b[sortBy];

    if (sortBy.includes("fecha")) {
      valueA = new Date(a[sortBy]).getTime();
      valueB = new Date(b[sortBy]).getTime();
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

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
            sortBy={"nombre"}
            sortOrder={"asc"}
          />
        ))}
      </ul>
    );
  }

  return (
    <ul className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
      {sortedDescuentos.map((desc) => (
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
          sortBy={"nombre"}
          sortOrder={"asc"}
        />
      ))}
    </ul>
  );
}
