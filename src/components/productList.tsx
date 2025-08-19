"use client"

import * as React from "react"
import { ProductCard, productProps } from "./ui/productCard"
import { useEffect, useState } from "react";

export function ProductList({
  sortBy,
  sortOrder,
  searchTerm = "",
}: {
  sortBy: "nombre" | "valor" | "fecha_inicio";
  sortOrder: "asc" | "desc";
  searchTerm?: string;
}) {

  const [productos, setProductos] = useState<productProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductos() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try API first, fallback to JSON file if API fails
        let res;
        let data;
        
        try {
          res = await fetch("/api/producto/consultaProducto");
          if (res.ok) {
            const json = await res.json();
            if (json.success) {
              data = json.data || [];
            } else {
              throw new Error(json.message || "API returned error");
            }
          } else {
            throw new Error(`API responded with status ${res.status}`);
          }
        } catch (apiError) {
          console.log("API failed, try again", apiError);
        }
        
        setProductos(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setProductos([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProductos();
  }, []);


  // Handle product deletion
  const handleDelete = async (productId: number) => {
    try {
      const res = await fetch("/api/producto/deleteProducto", {
        method: 'deleteProduct',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }),
      });

      if (res.ok) {
        // Remove the deleted product from state
        setProductos(prev => prev.filter(p => p.id !== productId));
        console.log("Product deleted successfully");
        alert('Se eliminó el producto correctamente');

      } else {
        console.error('Failed to delete product');
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  // Navigate to edit page
  const handleEdit = (productId: number) => {
    window.location.href = `/productManagement/edit/${productId}`;
  };

  // Filter products by search term
  const filteredProductos = productos.filter((producto) =>
    producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products after filtering
  const sortedProductos = [...filteredProductos].sort((a, b) => {
    let fieldA: string | number | Date;
    let fieldB: string | number | Date;

    switch (sortBy) {
      case "nombre":
        fieldA = a.name;
        fieldB = b.name;
        break;
      case "valor":
        fieldA = a.price;
        fieldB = b.price;
        break;
      case "fecha_inicio":
        fieldA = a.fecha_creacion;
        fieldB = b.fecha_creacion;
        break;
      default:
        fieldA = a.name;
        fieldB = b.name;
    }

    // Handle date sorting
    if (sortBy === "fecha_inicio") {
      fieldA = new Date(fieldA).getTime();
      fieldB = new Date(fieldB).getTime();
    }

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }

    return 0;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
        <div className="text-center text-gray-500 py-8">
          Cargando productos...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
        <div className="text-center text-red-500 py-8">
          Error: {error}
        </div>
      </div>
    );
  }

  // Empty state
  if (sortedProductos.length === 0) {
    return (
      <div className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
        <div className="text-center text-gray-500 py-8">
          {searchTerm ? `No se encontraron productos para "${searchTerm}"` : "No hay productos disponibles"}
        </div>
      </div>
    );
  }

  return (
    <ul className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
      {sortedProductos.map((producto) => (
        <ProductCard 
          key={producto.id}
          id={producto.id}
          name={producto.name}
          brand={producto.brand}
          codigo_barra={producto.codigo_barra}
          price={producto.price}
          id_proveedor={producto.id_proveedor}
          fecha_creacion={producto.fecha_creacion}
          fecha_actualizacion={producto.fecha_actualizacion}
          proveedores={producto.proveedores}
          stock={producto.stock}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </ul>
  );
}