"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  SetStateAction,
} from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { productoService } from "../Service/producto/ProductoService";
import { ProductoWithId, ProductoPayload } from "../Service/producto/producto";
import { DialogProducto } from "@/components/dialogProducto";
import CardProducto from "@/components/cardProduct";
import { marcaService } from "@/app/Service/marca/marcaService";
import { categoriaService } from "@/app/Service/categoria/CategoryService";
import { CategoriaWithId } from "@/app/Service/categoria/categoria";
import { MarcaWithId } from "../Service/marca/marca";
import { string } from "zod";

export default function GestionarProductos() {
  const [productos, setProductos] = useState<ProductoWithId[]>([]);
  const [marcas, setMarcas] = useState<MarcaWithId[]>([]);
  const [categorias, setCategorias] = useState<CategoriaWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: ProductoPayload = {
    id_producto: 0,
    nombre: "",
    precio: 0,
    codigo_barra: "",
    images: "",
    stock_cantidad: 0,
    stock_minimo: 0,
    marca_id: null,
    categoria_id: null,
  };
  const [modalForm, setModalForm] = useState<ProductoPayload>(emptyForm);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productosData, marcasData, categoriasData] = await Promise.all([
        productoService.getAll(),
        marcaService.getAll(),
        categoriaService.getAll(),
      ]);
      setProductos(productosData ?? []);
      setMarcas(marcasData ?? []);
      setCategorias(categoriasData ?? []);
    } catch (err) {
      console.error("Error cargando datos", err);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Inventario | Kiosco"
    loadData();
  }, [loadData]);

  const productosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? productos.filter((p) => p.nombre?.toLowerCase().includes(q))
      : productos;
  }, [productos, search]);

  const handleCreate = async () => {
    const payload = {
      nombre: modalForm.nombre,
      precio: modalForm.precio,
      codigo_barra: modalForm.codigo_barra,
      images: modalForm.images,
      stock: modalForm.stock_cantidad,
      stock_minimo: modalForm.stock_minimo,
      id_marca: modalForm.marca_id,
      id_categoria: modalForm.categoria_id,
    };

    console.log("Enviando para CREAR:", payload);

    try {
      setSubmitting(true);
      const response = await productoService.create(payload as any);

      if (response.error) {
        throw new Error(String(response.error));
      }

      await loadData();
      toast.success(`Producto creado con éxito`);
      setIsCreateOpen(false);
      setModalForm(emptyForm); // Resetea el form
    } catch (err: any) {
      console.error(
        "Error creando producto (página):",
        err.response?.data ?? err
      );
      let errorMessage = "Error al crear el producto";

      // Buscamos el error detallado (como el que nos mostraste de 'stock')
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
      // -------------------------------
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
        id_producto: data.id_producto,
        nombre: data.nombre ?? "",
        precio: data.precio ?? 0,
        stock_cantidad: data.stock?.[0]?.cantidad ?? 0,
        stock_minimo: data.stock?.[0]?.cantidad_min ?? 0,
        codigo_barra: data.codigo_barra ?? "",
        images: data.images ?? "",
        marca_id: data.marcas?.id_marca ?? null,
        categoria_id: data.categoria?.id_categoria ?? null,
      });
    } catch (err) {
      console.error("Error al procesar datos para editar", err);
      toast.error("Error al cargar datos para editar");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return; // if (!editingId || !validarCampos()) return;

    // 1. "Re-armamos" el payload para la API
    const payload = {
      id_producto: editingId, // Importante: el ID del producto
      nombre: modalForm.nombre,
      precio: modalForm.precio,
      codigo_barra: modalForm.codigo_barra,
      images: modalForm.images,

      // La API espera 'stock' como número
      stock: modalForm.stock_cantidad,
      stock_minimo: modalForm.stock_minimo,

      // La API espera los IDs con estos nombres
      id_marca: modalForm.marca_id,
      id_categoria: modalForm.categoria_id,
    };

    console.log("Enviando para ACTUALIZAR:", payload);
    try {
      setSubmitting(true);
      // 2. Enviamos el 'payload' re-armado
      await productoService.updatePatch(payload as any);

      await loadData();
      toast.success(`Producto actualizado con éxito`);
      setIsEditOpen(false);
      setEditingId(null);
      setModalForm(emptyForm); // Resetea el form
    } catch (err: any) {
      // (Bloque catch mejorado para mostrar detalles)
      console.error(
        "Error actualizando producto (página):",
        err.response?.data ?? err
      );
      let errorMessage = "Error al actualizar el producto";
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
        <h2 className=" font-bold text-2xl text-white"> Lista Productos</h2>
        <DialogProducto
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreate}
          title="Crear Producto"
          isSubmitting={submitting}
          marcasList={marcas}
          categoriasList={categorias}
          setModalForm={setModalForm}
          modalForm={modalForm}
        />

        {/* 11. Modal de Edición */}
        {isEditOpen && (
          <DialogProducto
            title="Editar Producto"
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={handleUpdate}
            isSubmitting={submitting}
            marcasList={marcas}
            categoriasList={categorias}
            setModalForm={setModalForm}
            modalForm={modalForm}
          />
        )}

        <div className="flex items-center w-full gap-4">
          <input
            type="text"
            placeholder="Buscar producto..." // Texto CORREGIDO
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm transition focus:border-blue-500 focus:outline-none focus:shadow-md"
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

        <div className="w-full bg-light-60 overflow-y-auto p-4 rounded-xl flex flex-col gap-3 dark:bg-dark-60">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              Cargando productos...
            </div>
          ) : productosFiltrados.length ? (
            productosFiltrados.map((p) => (
              <CardProducto
                key={p.id_producto}
                producto={p}
                onEdit={() => openEditModal(p.id_producto)}
                onDelete={() => handleDelete(p.id_producto)}
              />
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
