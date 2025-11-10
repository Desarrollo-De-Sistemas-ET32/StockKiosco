"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ProductoPayload, ProductoWithId } from "@/app/Service/producto/producto";
import { productoService } from "@/app/Service/producto/ProductoService";
import { marcaService } from "@/app/Service/marca/marcaService";
import { categoriaService } from "@/app/Service/categoria/CategoryService";

import ProductCard from "@/components/cardProduct";
import { DialogProducto } from "@/components/dialogProducto";
import { MarcaWithId } from "../Service/marca/marca";
import { CategoriaWithId } from "../Service/categoria/categoria";

export default function ProductManagement() {
  const [productos, setProductos] = useState<ProductoWithId[]>([]);
  const [marcas, setMarcas] = useState<MarcaWithId[]>([]);
  const [categorias, setCategorias] = useState<CategoriaWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductoWithId | null>(null);
  const [modalForm, setModalForm] = useState<ProductoPayload>({
    id_producto: 0,
    nombre: "",
    precio: 0,
    codigo_barra: "",
    images: "",
    stock_cantidad: 0,
    stock_minimo: 0,
    marca_id: null,
    categoria_id: null,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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
  }, []);

  useEffect(() => {
    loadData();
    document.title = "Inventario | Kiosco";
  }, [loadData]); // --- Funciones de Modal (Sin cambios) ---

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalForm({
      id_producto: 0,
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

  const openEditModal = (producto: ProductoWithId) => {
    setEditingProduct(producto);
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
    setIsDialogOpen(true);
  };

  const handleDelete = (producto: ProductoWithId) => {
    toast.promise(productoService.delete(producto.id_producto).then(loadData), {
      loading: `Eliminando ${producto.nombre}...`,
      success: "Producto eliminado",
      error: "Error al eliminar",
    });
  };

  const handleSubmit = async (formData: ProductoPayload) => {
    setIsSubmitting(true);

    const payload = {
      id_producto: formData.id_producto,
      nombre: formData.nombre,
      precio: formData.precio,
      codigo_barra: formData.codigo_barra,
      images: formData.images,
      stock: formData.stock_cantidad,
      stock_minimo: formData.stock_minimo,
      id_marca: formData.marca_id,
      id_categoria: formData.categoria_id,
    };

    try {
      if (editingProduct) {
        await productoService.updatePatch(payload as any);
        toast.success("Producto actualizado");
      } else {
        const response = await productoService.create(payload as any);
        if (response.error) throw new Error(String(response.error));
        toast.success("Producto creado");
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (err: any) {
      console.error("handleSubmit error:", err.response?.data ?? err);
      let errorMessage = "Error al guardar";
      if (
        err.response?.data?.details &&
        Array.isArray(err.response.data.details)
      ) {
        const detail = err.response.data.details[0];
        errorMessage = `Error en '${detail.field}': ${detail.message}`;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return (
      <main className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-5 p-5 bg-light-60 dark:bg-dark-30 rounded-md">
          <p>Cargando Productos</p>
          <Spinner className="size-10" />
        </div>
      </main>
    );
  }

  if (error)
    return <div className="text-center mt-10 text-danger">{error}</div>;

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-6 lg:mx-auto max-w-5xl">
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
      <div className="flex flex-col gap-6 w-full">
        {productos.length > 0 ? (
          productos.map((prod) => (
            <ProductCard
              key={prod.id_producto}
              producto={prod}
              onEdit={() => openEditModal(prod)}
              onDelete={() => handleDelete(prod)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No hay productos disponibles.
          </p>
        )}
        </div>
      <div className="w-full flex justify-center">
        <Button
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-light-30 dark:bg-dark-30 text-foreground hover:bg-light-30/70 dark:hover:bg-dark-30/70 text-lg px-6 py-3 rounded-2xl"
        >
          Agregar producto
        </Button>
      </div>
    </main>
  );
}
