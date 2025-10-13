"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/cardProduct";
import { NavBar } from "@/components/navBar";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { productoService } from "@/app/Service/producto/ProductoService";

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
  const router = useRouter();

  const fetchProductos = async () => {
    try {
      const data = await productoService.getAll();
      setProductos(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEdit = async (producto: Producto) => {
    const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
    if (!nuevoNombre) return;

    try {
      const result = await productoService.updatePatch({
        id_producto: producto.id_producto,
        nombre: nuevoNombre,
        precio: producto.precio,
        stock: producto.stock,
      });

      if (!result.success) {
        alert("Error al actualizar producto: " + (result.message || "desconocido"));
        return;
      }

      alert("Producto actualizado correctamente");
      fetchProductos();
    } catch (err: any) {
      console.error("Error al actualizar el producto:", err);
      alert("Error al actualizar el producto: " + (err.message || "desconocido"));
    }
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

  if (error) return <div>Error: {error}</div>;

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

      {}
      <div className="mt-6">
        <Button onClick={() => router.push("/crear_productos")}>Agregar producto</Button>
      </div>
    </main>
  );
}
