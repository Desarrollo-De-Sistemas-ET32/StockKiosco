"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { productoService } from "../Service/producto/ProductoService";
import { ProductoPayload, ProductoWithId } from "../Service/producto/producto";
import { DialogProducto } from "@/components/dialogProducto";
import ProductCard from "@/components/cardProduct";
import { marcaService } from "@/app/Service/marca/marcaService";
import { categoriaService } from "@/app/Service/categoria/CategoryService";
import { proveedorService } from "@/app/Service/proveedor/ProveedorService";
import { CategoriaWithId } from "@/app/Service/categoria/categoria";
import { MarcaWithId } from "@/app/Service/marca/marca";
import { ProveedorWithId } from "@/app/Service/proveedor/proveedor";

export default function ListaProductos() {
  const [productos, setProductos] = useState<ProductoWithId[]>([]);
  const [marcas, setMarcas] = useState<MarcaWithId[]>([]);
  const [categorias, setCategorias] = useState<CategoriaWithId[]>([]);
  const [proveedores, setProveedores] = useState<ProveedorWithId[]>([]);

  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: ProductoPayload = {
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
  };
  const [modalForm, setModalForm] = useState<ProductoPayload>(emptyForm);
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productosData, marcasData, categoriasData, proveedoresData] =
        await Promise.all([
          productoService.getAll(),
          marcaService.getAll(),
          categoriaService.getAll(),
          proveedorService.getAll(),
        ]);
      console.log("PROVEEDORES DESDE API:", proveedoresData);
      setProductos(productosData ?? []);
      setMarcas(marcasData ?? []);
      setCategorias(categoriasData ?? []);
      setProveedores(proveedoresData ?? []);
    } catch (err) {
      console.error("Error cargando datos", err);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    document.title = "Gestionar Productos | Kiosco";
  }, [loadData]);

  const productosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? productos.filter((p) => p.nombre?.toLowerCase().includes(q))
      : productos;
  }, [productos, search]);

  const validarCampos = () => {
    if (!modalForm.nombre || !modalForm.codigo_barra) {
      toast.error("Nombre y código de barra son requeridos");
      return false;
    }
    return true;
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validarCampos()) return;

    const payload = {
      nombre: modalForm.nombre,
      codigo_barra: modalForm.codigo_barra,
      precio: modalForm.precio,
      images: modalForm.images,
      stock: modalForm.stock_cantidad,
      stock_minimo: modalForm.stock_minimo,
      id_marca: modalForm.id_marca,
      id_categoria: modalForm.id_categoria,
      id_proveedor: modalForm.id_proveedor,
    };
    // --- DEBUG: MIRA LA CONSOLA DEL NAVEGADOR ---
    console.log("Enviando para CREAR:", modalForm);
    // ----------------------------------------------
    try {
      setSubmitting(true);
      const response = await productoService.create(payload as any); // (usamos 'as any' para que coincida con el service)

      if (response.error) {
        throw new Error(String(response.error));
      }

      await loadData();
      toast.success(`Producto creado con éxito`);
      setIsCreateOpen(false);
      setModalForm(emptyForm);
    } catch (err: any) {
      console.error("Error creando producto (página):", err);
      toast.error(err?.message ?? "Error creando producto");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (id?: number | string) => {
    const numericId = Number(id);
    if (!numericId) return toast.error("ID inválido");

    try {
      const data = productos.find((p) => p.id_producto === numericId);
      if (!data) {
        toast.error("Producto no encontrado en la lista");
        return;
      }
      setEditingId(numericId);
      setIsEditOpen(true);
      setModalForm({
        id_producto: data.id_producto ?? 0,
        nombre: data.nombre ?? "",
        codigo_barra: data.codigo_barra ?? "",
        precio: data.precio ?? 0,
        images: data.images ?? "",
        stock_cantidad: data.stock?.[0]?.cantidad ?? 0,
        stock_minimo: data.stock?.[0]?.cantidad_min ?? 0,
        id_marca: data.id_marca ?? null,
        id_categoria: data.id_categoria ?? null,
        id_proveedor: data.id_proveedor ?? null,
      });
      // --------------------
    } catch (err) {
      console.error("Error al procesar datos para editar", err);
      toast.error("Error al cargar datos para editar");
    }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingId || !validarCampos()) return;

    // 1. Mapeamos los campos también aquí
    const payload = {
      id_producto: editingId, // Importante
      nombre: modalForm.nombre,
      precio: modalForm.precio,
      codigo_barra: modalForm.codigo_barra,
      images: modalForm.images,

      // AQUÍ ESTÁ LA CORRECCIÓN:
      stock: modalForm.stock_cantidad,
      stock_minimo: modalForm.stock_minimo,

      id_marca: modalForm.id_marca,
      id_categoria: modalForm.id_categoria,
      id_proveedor: modalForm.id_proveedor,
    };

    try {
      setSubmitting(true);

      // 2. Enviamos el payload corregido
      await productoService.updatePatch(payload as any);

      await loadData();
      toast.success(`Producto actualizado con éxito`);
      setIsEditOpen(false);
      setEditingId(null);
      setModalForm(emptyForm);
    } catch (err: any) {
      console.error("Error actualizando producto", err);
      toast.error(err?.message ?? "Error actualizando producto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: number | string) => {
    const numericId = Number(id);
    if (!numericId) return;

    toast.promise(productoService.delete(numericId).then(loadData), {
      loading: "Eliminando producto...",
      success: "Producto eliminado con éxito",
      error: (err) =>
        err?.response?.data?.error ??
        err?.message ??
        "No se pudo eliminar el producto",
    });
  };

  return (
    <main>
      <div className="flex flex-col items-center gap-4 mx-auto my-5 font-sans max-w-[900px]">
        <h1 className="text-2xl font-semibold dark:text-white">
          Lista Productos
        </h1>
        <DialogProducto
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreate}
          title="Crear Producto"
          modalForm={modalForm}
          isSubmitting={submitting}
          setModalForm={setModalForm}
          marcasList={marcas}
          categoriasList={categorias}
          proveedorList={proveedores}
        ></DialogProducto>
        <div className="flex items-center w-full gap-4">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm transition
                       focus:border-blue-500 focus:outline-none focus:shadow-md"
          />
          <Button
            onClick={() => {
              setIsCreateOpen(true);
              setModalForm(emptyForm);
            }}
            className="bg-confirm"
          >
            Agregar
          </Button>
        </div>
        <DialogProducto
          title="Editar Producto"
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSubmit={handleUpdate}
          isSubmitting={submitting}
          modalForm={modalForm}
          setModalForm={setModalForm}
          marcasList={marcas}
          categoriasList={categorias}
          proveedorList={proveedores}
        ></DialogProducto>

        <div className="w-full bg-light-60 overflow-y-auto p-4 rounded-xl flex flex-col gap-3 dark:bg-dark-60">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              Cargando productos...
            </div>
          ) : productosFiltrados.length ? (
            productosFiltrados.map((p) => (
              <ProductCard
                key={p.id_producto ?? p.nombre}
                producto={p}
                onEdit={() => openEditModal(p.id_producto)}
                onDelete={() => handleDelete(p.id_producto)}
              ></ProductCard>
            ))
          ) : (
            <div className="flex items-center justify-center py-6 text-gray-500">
              No se encontraron productos
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
