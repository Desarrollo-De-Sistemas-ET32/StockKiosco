// src/app/inventory/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/cardProduct";
import { NavBar } from "@/components/navBar";
import { Spinner } from "@/components/ui/spinner";

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
}

export default function ProductManagement() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch desde tu API interna
  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/producto/leerProducto", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos de la API");
      }
      const data = await response.json();
      setProductos(data.products || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Función local para editar
  const handleEdit = (producto: Producto) => {
    console.log("Editar producto:", producto);
    // Aquí puedes abrir modal o redirigir a un formulario
  };

  if (loading) {
    return (
      <main className="w-full h-full flex flex-col justify-center items-center gap-[19rem]">
        <NavBar />
        <div className="flex justify-center items-center flex-col bg-var6 dark:bg-var2 rounded-md p-5 gap-5">
          <p>Cargando Productos</p>
          <Spinner className="size-10" />
        </div>
      </main>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="w-full flex flex-col items-center gap-5">
      <NavBar />
      <div className="flex justify-center flex-wrap gap-5">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductCard
              key={producto.id_producto}
              producto={producto}
              onClick={() => handleEdit(producto)}
              onUpdateSuccess={fetchProductos}
            />
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </main>
  );
}
