// src/app/productManagement/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/cardProduct";
import handleEdit from "@/components/cardProduct";

export default function ProductManagement() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const fetchProductos = async () => {
      try {
        const response = await fetch("/api/producto/verProducto");
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
        }
        const data = await response.json();
        setProductos(data.body);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocurrió un error desconocido");
        }
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