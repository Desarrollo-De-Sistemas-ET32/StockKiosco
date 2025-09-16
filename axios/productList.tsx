"use client"

import * as React from "react"
import { ProductCard } from "./ui/productCard"
import { useEffect, useState } from "react";
import productService from "@/app/service/productos";
import { productProps } from "@/types/product";

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
   async function getProductos() {
     try {
        setIsLoading(true);
        setError(null);
      
        const data = await productService.getProducts();
        console.log( data )//borrar
        if (data.status == 200) {
          console.log( data.data.products )//borrar
          setProductos(data.data.products || []);
        } else {
          throw new Error(data.statusText || "API returned error");
        }
      
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setProductos([]);
      } finally {
        setIsLoading(false);
      }
    }
  
    getProductos();
  }, []);


  // Eliminar producto
  const handleDelete = async (codigo_barra: number) => {
    // Pedir confirmación
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el producto con código de barra ${codigo_barra}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) {
      return;
    }

    //Si confirma, elimina el producto
    try {
      const res = await productService.deleteProduct(codigo_barra);
    
      // Check if the deletion was successful
      if (res.data.success) {
        setProductos(prev => prev.filter(p => p.codigo_barra !== codigo_barra));
        console.log("Product deleted successfully");
        alert(res.data.message || 'Se eliminó el producto correctamente');
      } else {
        console.error('Failed to delete product:', res.data.error);
        alert(res.data.error || 'Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };


  // Navigate to edit page / va hacia la vista editar producto, dandole el id
  const handleEdit = (productId: number) => {
    window.location.href = `/productManagement/edit/${productId}`;
  };

  // Filter products by search term
  const filteredProductos = productos.filter((producto) =>
    (producto.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (producto.id_marca || '').toLowerCase().includes(searchTerm.toLowerCase())
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
      console.log('Final sortedProductos:', sortedProductos);
      console.log('First product details:', sortedProductos[0]);
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
        
    }

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      console.log('Final sortedProductos:', sortedProductos);
      console.log('First product details:', sortedProductos[0]);

      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }

    return 0;
  });
  console.log('sortedProductos:', sortedProductos);
  console.log('First product:', sortedProductos[0]);

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
      {sortedProductos.map((producto, index) => (
        <ProductCard 
          key={producto.id || `product-${index}`}
          id={producto.id}
          name={producto.name}
          id_marca={producto.id_marca}
          codigo_barra={producto.codigo_barra}
          price={producto.price}
          id_proveedor={producto.id_proveedor}
          fecha_creacion={producto.fecha_creacion}
          fecha_actualizacion={producto.fecha_actualizacion}
          proveedores={producto.proveedores}
          stock={producto.stock}
          onDelete={handleDelete}
          onEdit={handleEdit} 
          id_categoría={0} 
          images={""}        
          />
      ))}
    </ul>
  );
}