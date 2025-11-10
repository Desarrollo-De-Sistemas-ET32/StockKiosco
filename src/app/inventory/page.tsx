"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// --- 1. Importa TODO lo que necesitas ---
import { productoService } from "@/app/Service/producto/ProductoService";
import { marcaService } from "@/app/Service/marca/marcaService";
import { categoriaService } from "@/app/Service/categoria/CategoryService";

import ProductCard from "@/components/cardProduct";
import { DialogProducto } from "@/components/dialogProducto"; // El modal de formulario

// --- 2. Define tus tipos (idealmente en un archivo .ts) ---
interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
  stock?: { id_stock: number; cantidad: number; cantidad_min: number }[];
  codigo_barra?: string;
  images?: string; // Corregido de 'imagen' para coincidir con tu service
  categoria?: { id_categoria: number; nombre: string };
  marcas?: { id_marca: number; nombre_marca: string };
  // (Añade los IDs planos que usa el service)
  id_marca?: number;
  id_categoria?: number;
}
interface ProductoPayload {
  // (Define tu payload aquí, como lo hicimos en el paso anterior)
  id_producto?: number;
  nombre: string;
  precio: number;
  stock_cantidad: number;
  stock_minimo: number;
  codigo_barra: string;
  images: string;
  marca_id: number | null;
  categoria_id: number | null;
}
interface Marca {
  id_marca: number;
  nombre_marca: string;
}
interface Categoria {
  id_categoria: number;
  nombre: string;
}
// --- Fin de Tipos ---

export default function ProductManagement() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Ya lo tenías

  // --- 3. Estado para el Modal y Formulario ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // El producto que se está editando (o null si es 'Crear')
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  // El estado del formulario
  const [modalForm, setModalForm] = useState<ProductoPayload>({
    nombre: "",
    precio: 0,
    codigo_barra: "",
    images: "",
    stock_cantidad: 0,
    stock_minimo: 0,
    marca_id: null,
    categoria_id: null,
  });

  // --- 4. Carga TODOS los datos al inicio ---
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargamos todo en paralelo
      const [productosData, marcasData, categoriasData] = await Promise.all([
        productoService.getAll(),
        marcaService.getAll(),
        categoriaService.getAll(),
      ]);
      setProductos(productosData ?? []);
      setMarcas(marcasData ?? []);
      setCategorias(categoriasData ?? []);
    } catch (err: any) {
      console.error("loadData error:", err);
      setError(err?.message ?? "Error al obtener datos");
    } finally {
      setLoading(false);
    }
  }, []); // Dependencia vacía, se crea 1 vez

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- 5. Define las funciones que faltaban ---

  const openCreateModal = () => {
    setEditingProduct(null); // 'null' significa 'Crear'
    // Resetea el formulario
    setModalForm({
      nombre: "",
      precio: 0,
      codigo_barra: "",
      images: "",
      stock_cantidad: 0,
      stock_minimo: 0,
      marca_id: null,
      categoria_id: null,
    });
    setIsDialogOpen(true);
  };

  const openEditModal = (producto: Producto) => {
    setEditingProduct(producto); // Guarda el producto

    // Mapea el producto anidado al formulario plano
    setModalForm({
      id_producto: producto.id_producto,
      nombre: producto.nombre ?? "",
      precio: producto.precio ?? 0,
      codigo_barra: producto.codigo_barra ?? "",
      images: producto.images ?? "",
      stock_cantidad: producto.stock?.[0]?.cantidad ?? 0,
      stock_minimo: producto.stock?.[0]?.cantidad_min ?? 0,
      marca_id: producto.marcas?.id_marca ?? null,
      categoria_id: producto.categoria?.id_categoria ?? null,
    });

    setIsDialogOpen(true); // Abre el modal
  };

  const handleDelete = (producto: Producto) => {
    toast.promise(
      productoService.delete(producto.id_producto).then(loadData), // Recarga al éxito
      {
        loading: `Eliminando ${producto.nombre}...`,
        success: "Producto eliminado",
        error: "Error al eliminar",
      }
    );
  };

  // Función para el 'onSubmit' del modal
  const handleSubmit = async (formData: ProductoPayload) => {
    setIsSubmitting(true);

    // 1. Re-arma el payload para la API (con stock anidado, etc.)
    const payload = {
      id_producto: formData.id_producto, // Será 'undefined' al crear
      nombre: formData.nombre,
      precio: formData.precio,
      codigo_barra: formData.codigo_barra,
      images: formData.images,
      stock: [
        {
          cantidad: formData.stock_cantidad,
          cantidad_min: formData.stock_minimo,
        },
      ],
      id_marca: formData.marca_id,
      id_categoria: formData.categoria_id,
    };

    try {
      if (editingProduct) {
        // --- Lógica de ACTUALIZAR ---
        await productoService.updatePatch(payload as any); // (Asegúrate que updatePatch acepte esto)
        toast.success("Producto actualizado");
      } else {
        // --- Lógica de CREAR ---
        const response = await productoService.create(payload as any);
        if (response.error) throw new Error(String(response.error));
        toast.success("Producto creado");
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      loadData(); // Recargamos la lista
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 6. Renderizado ---

  if (loading) {
    return (
      <main className="flex items-center justify-center h-[80vh]">
               {" "}
        <div className="flex flex-col items-center gap-5 p-5 bg-light-60 dark:bg-dark-30 rounded-md">
                    <p>Cargando Productos</p>
                    <Spinner className="size-10" />       {" "}
        </div>
             {" "}
      </main>
    );
  }

  if (error)
    return <div className="text-center mt-10 text-danger">{error}</div>;

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-6 lg:mx-auto max-w-5xl">
      {/* 7. Renderiza el Modal (estará oculto) */}
      <DialogProducto
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        modalForm={modalForm}
        setModalForm={setModalForm}
        marcasList={marcas}
        categoriasList={categorias}
        title={editingProduct ? "Editar Producto" : "Crear Producto"}
      />
           {" "}
      <div className="flex flex-col gap-6 w-full">
               {" "}
        {productos.length > 0 ? (
          productos.map((prod) => (
            <ProductCard
              key={prod.id_producto}
              producto={prod}
              // 8. Ahora estas funciones SÍ existen
              onEdit={() => openEditModal(prod)}
              onDelete={() => handleDelete(prod)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No hay productos disponibles.
          </p>
        )}
             {" "}
      </div>
           {" "}
      <div className="w-full flex justify-center">
               {" "}
        <Button
          // 9. Conecta el botón de 'Agregar'
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-light-30 dark:bg-dark-30 text-foreground hover:bg-light-30/70 dark:hover:bg-dark-30/70 text-lg px-6 py-3 rounded-2xl"
        >
                    Agregar producto{" "}
        </Button>
             {" "}
      </div>
         {" "}
    </main>
  );
}
