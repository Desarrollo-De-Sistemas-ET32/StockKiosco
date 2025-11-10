"use client";

import { useEffect, useMemo, useState, useCallback, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import descuentoService from "../Service/descuento/DescuentoService";
import { DescuentoDB, DescuentoPayload, TipoDescuento } from "../Service/descuento/descuento";
import {DialogDescuento} from "@/components/dialogDescuento";
import CardDescuento from "@/components/cardDiscount";

export default function ListaDescuentos() {
  const [descuentos, setDescuento] = useState<DescuentoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const emptyForm: DescuentoPayload = {
    nombre: "",
    descripcion: "",
    tipo: "MONTOFIJO",
    fecha_fin: "",
    fecha_inicio: "",
    activo: false,
    valor: "",
  };
  const [modalForm, setModalForm] = useState<DescuentoPayload>(emptyForm);

  // ✅ Función reutilizable para cargar proveedores
  const loadDescuentos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await descuentoService.getAll();
      setDescuento(data);
    } catch (err) {
      console.error("Error cargando descuentos", err);
      toast.error("Error al cargar descuentos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDescuentos();
  }, [loadDescuentos]);

  const descuentosFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? descuentos.filter((d) => d.nombre?.toLowerCase().includes(q))
      : descuentos;
  }, [descuentos, search]);

  const validarCampos = () => {
    if (!modalForm.tipo || !modalForm.nombre) {
      toast.error("Nombre y tipo de descuento son requeridos");
      return false;
    }
    return true;
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validarCampos()) return;

    // --- DEBUG: MIRA LA CONSOLA DEL NAVEGADOR ---
    console.log("Enviando para CREAR:", modalForm);
    // ----------------------------------------------

    try {
      setSubmitting(true);
      // 1. Captura la respuesta del servicio
      const response = await descuentoService.create(modalForm);

      // 2. VERIFICA LA RESPUESTA
      if (response.error) {
        // 3. Si hay un error, lánzalo para que lo atrape el CATCH
        throw new Error(String(response.error));
      }

      await loadDescuentos();
      toast.success(
        `Descuento creado con éxito a las ${new Date().toLocaleTimeString(
          "es-AR",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`
      );
      setIsCreateOpen(false);
      setModalForm(emptyForm);
    } catch (err: any) {
      // 4. Ahora este CATCH sí recibirá el error
      console.error("Error creando descuento:", err);
      toast.error(err?.message ?? "Error creando descuento");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (id?: number | string) => { 
    const numericId = Number(id);
    if (!numericId) return toast.error("ID inválido");

    try {
      // 1. Busca el descuento en el estado 'descuentos' que ya cargaste
      const data = descuentos.find(d => d.id_descuento === numericId);

      // 2. Comprueba si se encontró
      if (!data) {
        toast.error("Descuento no encontrado en la lista");
        return;
      }

      // 3. Procesa los datos localmente (sin 'await')
      setEditingId(numericId);
      setIsEditOpen(true);
      setModalForm({
        nombre: data.nombre ?? "",
        descripcion: data.descripcion ?? "",
        tipo: data.tipo ?? "MONTOFIJO",
        fecha_fin: data.fecha_fin ?? "",
        fecha_inicio: data.fecha_inicio ?? "",
        activo: data.activo ?? false,
        valor: String(data.valor ?? ""),
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

    try {
      setSubmitting(true);
      await descuentoService.updatePatch(editingId, modalForm);

      await loadDescuentos();
      toast.success(
        `Proveedor actualizado con éxito a las ${new Date().toLocaleTimeString(
          "es-AR",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`
      );
      setIsEditOpen(false);
      setEditingId(null);
      setModalForm(emptyForm);
    } catch (err: any) {
      console.error("Error actualizando proveedor", err);
      toast.error(
        err?.response?.data?.error ??
          err?.message ??
          "Error actualizando proveedor"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: number | string) => {
    const numericId = Number(id);
    if (!numericId) return;

    toast.promise(
      descuentoService.delete(numericId).then(loadDescuentos), // <-- CORREGIDO
      {
        loading: "Eliminando descuento...", // <-- CORREGIDO
        success: "Descuento eliminado con éxito",
        error: (err) =>
          err?.response?.data?.error ??
          err?.message ??
          "No se pudo eliminar el descuento",
      }
    );
  };

  return (
    <main>
      <div className="flex flex-col items-center gap-4 mx-auto my-5 font-sans max-w-[900px]">
        <h1 className="text-2xl font-semibold dark:text-white">
          Lista Descuentos
        </h1>
        <DialogDescuento
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreate}
          title="Crear Descuento"
          modalForm={modalForm}
          isSubmitting={submitting}
          setModalForm={setModalForm}
          ></DialogDescuento>
        <div className="flex items-center w-full gap-4">
          <input
            type="text"
            placeholder="Buscar descuento..."
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

        {isEditOpen && (
          <DialogDescuento
            title="Editar Descuento"
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={handleUpdate}
            modalForm={modalForm}
            isSubmitting={submitting}
            setModalForm={setModalForm}
          />
        )}

        <div className="w-full bg-light-60 overflow-y-auto p-4 rounded-xl flex flex-col gap-3 dark:bg-dark-60">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              Cargando descuentos...
            </div>
          ) : descuentosFiltrados.length ? ( // <-- CORREGIDO
            descuentosFiltrados.map((d) => (
              <CardDescuento
                key={d.id_descuento ?? d.nombre}
                {...d}
                onEdit={openEditModal}
                onDelete={handleDelete}
              ></CardDescuento>
            ))
          ) : (
            <div className="flex items-center justify-center py-6 text-gray-500">
              No se encontraron proveedores
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
