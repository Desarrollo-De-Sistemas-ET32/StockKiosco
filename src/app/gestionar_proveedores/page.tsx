"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CardProveedor from "@/components/gestion-card";
import { proveedorService } from "@/app/Service/proveedor/ProveedorService";
import type { ProveedorPayload, ProveedorWithId } from "@/app/Service/proveedor/proveedor";
import { DialogProveedor } from "@/components/dialogProveedorCreate";
import { DialogProveedorUpd } from "@/components/dialogProveedorUpdate";
import { toast } from "sonner";

export default function ListaProveedores() {
  const [proveedores, setProveedores] = useState<ProveedorWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: ProveedorPayload = {
    nombre: "",
    email: "",
    direccion: "",
    contacto: "",
    telefono: "",
  };
  const [modalForm, setModalForm] = useState<ProveedorPayload>(emptyForm);

  // ✅ Función reutilizable para cargar proveedores
  const loadProveedores = useCallback(async () => {
    try {
      setLoading(true);
      const data = await proveedorService.getAll();
      setProveedores(data);
    } catch (err) {
      console.error("Error cargando proveedores", err);
      toast.error("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Gestionar Proveedores | Kiosco";
    loadProveedores();
  }, [loadProveedores]);

  const proveedoresFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? proveedores.filter((p) => p.nombre?.toLowerCase().includes(q))
      : proveedores;
  }, [proveedores, search]);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarCampos = () => {
    if (!modalForm.nombre || !modalForm.email) {
      toast.error("Nombre y email son requeridos");
      return false;
    }
    return true;
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validarCampos()) return;

    try {
      setSubmitting(true);
      await proveedorService.create(modalForm);
      await loadProveedores();
      toast.success(
        `Proveedor creado con éxito a las ${new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
      setIsCreateOpen(false);
      setModalForm(emptyForm);
    } catch (err: any) {
      console.error("Error creando proveedor", err);
      toast.error(err?.response?.data?.error ?? err?.message ?? "Error creando proveedor");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = async (id?: number | string) => {
    const numericId = Number(id);
    if (!numericId) return toast.error("ID inválido");

    try {
      setEditingId(numericId);
      setIsEditOpen(true);
      const data = await proveedorService.getById(numericId);
      if (!data) {
        toast.error("Proveedor no encontrado");
        setIsEditOpen(false);
        return;
      }
      setModalForm(data);
    } catch (err) {
      console.error("Error al cargar proveedor para editar", err);
      toast.error("Error al cargar datos para editar");
      setIsEditOpen(false);
    }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingId || !validarCampos()) return;

    try {
      setSubmitting(true);
      await proveedorService.update(editingId, modalForm);
      await loadProveedores();
      toast.success(
        `Proveedor actualizado con éxito a las ${new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
      setIsEditOpen(false);
      setEditingId(null);
      setModalForm(emptyForm);
    } catch (err: any) {
      console.error("Error actualizando proveedor", err);
      toast.error(err?.response?.data?.error ?? err?.message ?? "Error actualizando proveedor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: number | string) => {
    const numericId = Number(id);
    if (!numericId) return;

    toast.promise(
      proveedorService.delete(numericId).then(loadProveedores),
      {
        loading: "Eliminando proveedor...",
        success: "Proveedor eliminado con éxito",
        error: (err) =>
          err?.response?.data?.error ?? err?.message ?? "No se pudo eliminar el proveedor",
      }
    );
  };

  return (
    <main>
      <div className="flex flex-col items-center gap-4 mx-auto my-5 font-sans max-w-[900px]">
        <h1 className="text-2xl font-semibold dark:text-white">Lista Proveedores</h1>

        <DialogProveedor
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          handleCreate={handleCreate}
          handleModalChange={handleModalChange}
          modalForm={modalForm}
          isSubmitting={submitting}
        />

        <div className="flex items-center w-full gap-4">
          <input
            type="text"
            placeholder="Buscar proveedor..."
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

        <div className="w-full bg-light-60 overflow-y-auto p-4 rounded-xl flex flex-col gap-3 dark:bg-dark-60">
          {loading ? (
            <div className="flex items-center justify-center py-6">Cargando proveedores...</div>
          ) : proveedoresFiltrados.length ? (
            proveedoresFiltrados.map((p) => (
              <CardProveedor
                key={p.id_proveedor ?? p.nombre}
                id={p.id_proveedor}
                nombre={p.nombre}
                telefono={p.telefono}
                cuil={(p as any).cuil ?? ""}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="flex items-center justify-center py-6 text-gray-500">
              No se encontraron proveedores
            </div>
          )}
        </div>
      </div>

      {isEditOpen && (
        <DialogProveedorUpd
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          isSubmitting={submitting}
          modalForm={modalForm}
          handleModalChange={handleModalChange}
          handleUpdate={handleUpdate}
        />
      )}
    </main>
  );
}