// src/app/productManagement/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/cardProduct";
import handleEdit from "@/components/cardProduct";
import { NavBar } from "@/components/navBar";

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export default function ProductManagement() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const fetchProductos = async () => {
      try {
        const response = await fetch("/api/producto/verProducto");
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
        }
        const data = await response.json();
        setProductos(data.body || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="w-full flex flex-col items-center gap-5">
       <div className="w-full flex justify-center text-sm text-muted-foreground">
          <NavBar></NavBar>
        </div>
      <div className="flex justify-center flex-wrap gap-5">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductCard key={producto.id_producto} producto={producto} onClick={handleEdit} onUpdateSuccess={fetchProductos}/>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div> 
    </main>
    
  );
}