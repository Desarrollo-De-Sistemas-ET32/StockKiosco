// app/Service/DescuentoService.ts
import api from "../API";
import type {
  DescuentoPayload,
  DescuentoDB,
  CreateDescuentoResponse,
} from "./descuento";

function parseNumberSafe(v: any): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

function toISODate(v?: string | Date | null): string | null {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  try {
    const d = new Date(String(v));
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
}

export const descuentoService = {
  // 🔹 Leer todos los descuentos
  getAll: async (): Promise<DescuentoDB[]> => {
    try {
      const resp = await api.get("/descuento/leerDescuento");
      const data = resp.data;
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data.descuentos)
        ? data.descuentos
        : data.items ?? [];

      return items.map((d: any) => ({
        id_descuento: Number(d.id_descuento ?? d.id ?? 0),
        nombre: String(d.nombre ?? ""),
        descripcion: d.descripcion ?? null,
        tipo: String(d.tipo ?? "PORCENTAJE") as DescuentoDB["tipo"],
        valor: parseNumberSafe(d.valor ?? d.value ?? 0),
        fecha_inicio: d.fecha_inicio
          ? new Date(d.fecha_inicio).toISOString()
          : null,
        fecha_fin: d.fecha_fin ? new Date(d.fecha_fin).toISOString() : null,
        fecha_creacion: d.fecha_creacion
          ? new Date(d.fecha_creacion).toISOString()
          : new Date().toISOString(),
        fecha_actualizacion: d.fecha_actualizacion
          ? new Date(d.fecha_actualizacion).toISOString()
          : new Date().toISOString(),
        activo:
          typeof d.activo === "boolean"
            ? d.activo
            : d.activo === 1 || d.activo === "1"
            ? true
            : false, // <-- CORREGIDO
      }));
    } catch (err: any) {
      console.error("descuentoService.getAll error", err);
      const resp = err?.response;
      if (resp?.data)
        throw new Error(
          resp.data?.error ?? resp.data?.message ?? JSON.stringify(resp.data)
        );
      throw err;
    }
  },

  // 🔹 Obtener descuento por ID
  getById: async (id: number): Promise<DescuentoDB | null> => {
    try {
      const resp = await api.get(`/descuento/${id}`);
      const d = resp.data;
      if (!d) return null;

      return {
        id_descuento: Number(d.id_descuento ?? d.id ?? id),
        nombre: String(d.nombre ?? ""),
        descripcion: d.descripcion ?? null,
        tipo: String(d.tipo ?? "PORCENTAJE") as DescuentoDB["tipo"],
        valor: parseNumberSafe(d.valor ?? 0),
        fecha_inicio: d.fecha_inicio
          ? new Date(d.fecha_inicio).toISOString()
          : null,
        fecha_fin: d.fecha_fin ? new Date(d.fecha_fin).toISOString() : null,
        fecha_creacion: d.fecha_creacion
          ? new Date(d.fecha_creacion).toISOString()
          : new Date().toISOString(),
        fecha_actualizacion: d.fecha_actualizacion
          ? new Date(d.fecha_actualizacion).toISOString()
          : new Date().toISOString(),
        activo:
          typeof d.activo === "boolean"
            ? d.activo
            : d.activo === 1 || d.activo === "1"
            ? true
            : true,
      };
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      console.error(`descuentoService.getById(${id}) error`, err);
      throw err;
    }
  },

  // 🔹 Crear descuento
  create: async (
    payload: DescuentoPayload
  ): Promise<CreateDescuentoResponse> => {
    try {
      const body = {
        nombre: payload.nombre,
        descripcion: payload.descripcion ?? null,
        tipo: payload.tipo,
        valor: parseNumberSafe(payload.valor),
        fecha_inicio: toISODate(payload.fecha_inicio),
        fecha_fin: toISODate(payload.fecha_fin),
        activo: payload.activo ?? true,
      };

      const resp = await api.post("/descuento/crearDescuento", body);
      const data = resp.data;

      if (!data) return { error: "Respuesta inválida del servidor" };
      if ((data as any).error) return { error: (data as any).error };

      const descuento = (data as any).descuento ?? data;
      return { success: true, descuento: descuento as DescuentoDB };
    } catch (err: any) {
      console.error("descuentoService.create error", err);
      const resp = err?.response;
      if (resp?.data)
        return {
          error: String(
            resp.data?.error ?? resp.data?.message ?? JSON.stringify(resp.data)
          ),
        };
      return { error: err?.message ?? String(err) };
    }
  },

  // 🔹 Editar descuento
  updatePatch: async (
    id: number, // <-- Argumento 1: El ID
    payload: Partial<DescuentoPayload> // <-- Argumento 2: El formulario
  ): Promise<DescuentoDB> => {
    try {
      // Creamos el body a partir del payload
      const body: any = { ...payload }; // Transformamos los campos que vinieron en el payload

      if (body.valor !== undefined) {
        body.valor = parseNumberSafe(body.valor);
      }
      if (body.fecha_inicio !== undefined) {
        body.fecha_inicio = toISODate(body.fecha_inicio);
      }
      if (body.fecha_fin !== undefined) {
        body.fecha_fin = toISODate(body.fecha_fin);
      }
      if (body.activo !== undefined) {
        body.activo = Boolean(body.activo);
      } // Agregamos el ID al body, que es lo que tu API espera

      body.id_descuento = id; // La URL parece ser no-RESTful, así que la mantenemos

      const resp = await api.patch("/descuento/editarDescuento", body);
      return resp.data as DescuentoDB;
    } catch (err: any) {
      console.error(`descuentoService.updatePatch(${id}) error`, err); // Mejor log
      const resp = err?.response;
      if (resp?.data) {
        const server = resp.data;
        const msg = server?.error ?? server?.message ?? JSON.stringify(server);
        throw new Error(String(msg));
      }
      throw err;
    }
  },

  // 🔹 Eliminar descuento
  delete: async (
    id: number
  ): Promise<{ success: true } | { success: false; error: string }> => {
    try {
      await api.delete("/descuento/eliminarDescuento", {
        data: { id_descuento: id },
      });
      return { success: true };
    } catch (err: any) {
      console.error("descuentoService.delete error", err);
      const resp = err?.response;
      const msg =
        resp?.data?.error ?? resp?.data?.message ?? err?.message ?? String(err);
      return { success: false, error: String(msg) };
    }
  },
};

export default descuentoService;
