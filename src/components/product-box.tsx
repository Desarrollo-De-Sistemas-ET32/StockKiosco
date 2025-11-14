"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// 1. Importar todo lo necesario (Rutas Corregidas)
import { DialogProducto } from "@/components/dialogProducto";
import { productoService } from "@/app/Service/producto/ProductoService";
import { marcaService } from "@/app/Service/marca/marcaService";
import { categoriaService } from "@/app/Service/categoria/CategoryService";
import { proveedorService } from "@/app/Service/proveedor/ProveedorService";
import { ProductoPayload, ProductoWithId } from "../app/Service/producto/producto";
import { MarcaWithId } from "@/app/Service/marca/marca";
import { CategoriaWithId } from "@/app/Service/categoria/categoria";
import { ProveedorWithId } from "@/app/Service/proveedor/proveedor";

// 2. Props: Ahora solo recibe el producto
type StockBajoProps = {
  producto: ProductoWithId;
};

export default function StockBajo({ producto }: StockBajoProps) {
  // 3. Añadimos de vuelta los estados para el Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalForm, setModalForm] = useState<ProductoPayload>({
    id_producto: 0,
    nombre: "",
    codigo_barra: "",
    precio: 0,
    images: "",
    stock_cantidad: 0,
    stock_minimo: 0,
    id_marca: null,
    id_categoria: null,
    id_proveedor: null,
  });

  // 4. Añadimos estados para las listas (marcas, categorías, etc.)
  const [marcas, setMarcas] = useState<MarcaWithId[]>([]);
  const [categorias, setCategorias] = useState<CategoriaWithId[]>([]);
  const [proveedores, setProveedores] = useState<ProveedorWithId[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  // 5. Lógica para cargar las listas (se ejecuta 1 vez)
  const loadData = useCallback(async () => {
    try {
      setLoadingLists(true);
      // No necesitamos cargar 'productos', solo las listas de soporte
      const [marcasData, categoriasData, proveedoresData] = await Promise.all([
        marcaService.getAll(),
        categoriaService.getAll(),
        proveedorService.getAll(),
      ]);
      setMarcas(marcasData ?? []);
      setCategorias(categoriasData ?? []);
      setProveedores(proveedoresData ?? []);
    } catch (err) {
      console.error("Error cargando listas", err);
      toast.error("Error al cargar datos de soporte");
    } finally {
      setLoadingLists(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 6. Lógica para ABRIR el modal (ahora es interna)
  const openReabastecerModal = (producto: ProductoWithId) => {
    if (!producto) return;

    setEditingId(producto.id_producto);
    setIsEditOpen(true);
    setModalForm({
      id_producto: producto.id_producto,
      nombre: producto.nombre ?? "",
      codigo_barra: producto.codigo_barra ?? "",
      precio: producto.precio ?? 0,
      images: producto.images ?? "",
      stock_cantidad: producto.stock?.[0]?.cantidad ?? 0,
      stock_minimo: producto.stock?.[0]?.cantidad_min ?? 0,
      id_marca: producto.id_marca ?? null,
      id_categoria: producto.id_categoria ?? null,
      id_proveedor: producto.id_proveedor ?? null,
    });
  };

  // 7. Lógica para ACTUALIZAR (ahora es interna)
  const handleUpdate = async () => {
    if (!editingId) return;

    const payload = {
      id_producto: editingId,
      nombre: modalForm.nombre,
      precio: modalForm.precio,
      codigo_barra: modalForm.codigo_barra,
      images: modalForm.images,
      stock: modalForm.stock_cantidad,
      stock_minimo: modalForm.stock_minimo,
      id_marca: modalForm.id_marca,
      id_categoria: modalForm.id_categoria,
      id_proveedor: modalForm.id_proveedor,
    };

    try {
      setSubmitting(true);
      await productoService.updatePatch(payload as any);
      toast.success(`Producto actualizado con éxito`);
      setIsEditOpen(false);
      setEditingId(null);
      // Opcional: podrías necesitar una función 'onUpdateSuccess'
      // para avisar al padre que debe recargar la lista de productos.
    } catch (err: any) {
      console.error("Error actualizando producto", err);
      toast.error(err?.message ?? "Error actualizando producto");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Renderizado del componente ---

  if (!producto) {
    return null; // Guard clause (que ya tenías)
  }

  const nombreProducto = producto.nombre;
  const unidades = producto.stock?.[0]?.cantidad ?? 0;
  const minimoUnidades = producto.stock?.[0]?.cantidad_min ?? 0;

  let unidad = "unidad";
  if (unidades > 1 || unidades === 0) {
    unidad = "unidades";
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center bg-light-30 dark:bg-dark-60 p-4 rounded-xl gap-5 w-full">
        <div>
          <p className="font-semibold">{nombreProducto}</p>
          <p className="text-sm">Mínimo requerido: {minimoUnidades}</p>
        </div>
        <div className="flex flex-col gap-5 xl:flex-row">
          <Button className="hover:cursor-default bg-danger text-foreground rounded-xl">
            {unidades} {unidad}
          </Button>
          <Button
            className="flex justify-center items-center bg-neutral text-foreground hover:bg-neutral/80 text-md rounded-xl p-2"
            // 8. El onClick ahora llama a la función interna
            onClick={() => openReabastecerModal(producto)}
            disabled={loadingLists} // Deshabilitado mientras cargan las listas
          >
            <Plus />
            Reabastecer
          </Button>
        </div>
      </div>

      {/* 9. El Diálogo ahora vive DENTRO del componente */}
      {isEditOpen && (
        <DialogProducto
          title="Reabastecer Producto"
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSubmit={handleUpdate}
          isSubmitting={submitting}
          modalForm={modalForm}
          setModalForm={setModalForm}
          marcasList={marcas}
          categoriasList={categorias}
          proveedorList={proveedores}
        />
      )}
    </>
  );
}