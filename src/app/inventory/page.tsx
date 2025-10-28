"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/cardProduct";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { productoService } from "@/app/Service/producto/ProductoService";

interface Producto {
  imagen: any;
  categoria: {id_categoria: number; nombre: string};
  marcas: {id_marca: number; nombre_marca: string}[];
  id_producto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: { id_stock: number; cantidad: number ; cantidad_min: number}[];
  codigo_barra: string;
}

export default function ProductManagement() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProductos = async () => {
    try {
      const data = await productoService.getAll();
      const formattedData: Producto[] = data.map((item: any) => ({
        id_producto: item.id_producto,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        stock: item.stock,
        codigo_barra: item.codigo_barra,
        imagen: item.imagen,
        categoria: item.categoria,
        marcas: item.marcas,
      }));
      setProductos(formattedData);
    } catch (err: any) {
      setError(err.message || "Error al obtener productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);
  console.log(productos)

  const handleEdit = async (producto: Producto) => {
    const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
    if (!nuevoNombre) return;

    try {
      const result = await productoService.updatePatch({
        id_producto: producto.id_producto,
        nombre: nuevoNombre,
        precio: producto.precio,
        stock: producto.stock,
        codigo_barra: producto.codigo_barra,
        images: producto.imagen,
        categoria: producto.categoria.nombre,
        marca: producto.marcas.length > 0 ? producto.marcas[0].nombre_marca : "nulo"
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
      <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-3 lg:mx-50">
        <div className="flex justify-center items-center flex-col bg-var6 dark:bg-var2 rounded-md p-5 gap-5">
          <p>Cargando Productos</p>
          <Spinner className="size-10" />
        </div>
      </main>
    );
  }

  if (error) return <div className="text-center mt-10 text-danger">{error}</div>;

return (
  <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-6 lg:mx-50">
    {/* Contenedor de productos */}
    <div className="flex flex-col gap-6 w-full">
      {productos.length > 0 ? (
        productos.map((producto) => (
          <ProductCard
            key={producto.id_producto}
            producto={producto}
            onUpdateSuccess={fetchProductos}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-muted-foreground">
          No hay productos disponibles.
        </p>
      )}
    </div>

    {/* Botón agregar */}
    <div className="w-full flex justify-center">
      <Button
        onClick={() => router.push("/crear_productos")}
        className="w-full sm:w-auto bg-var5 dark:bg-var1 text-foreground hover:bg-var4 dark:hover:bg-var3 text-lg px-6 py-3 rounded-2xl"
      >
        Agregar producto
      </Button>
    </div>
  </main>
);
}
