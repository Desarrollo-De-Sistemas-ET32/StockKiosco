// app/Service/ventas/VentasService.ts
import api from '../API';
import type { NuevaVenta, CreateVentaResponse, VentaDB } from './ventas';

function parseNumberSafe(v: any): number | null {
  if (v == null) return null;
  if (typeof v === 'number') return Number.isNaN(v) ? null : v;
  const n = Number(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(n) ? null : n;
}

export const ventasService = {
  create: async (
    payload: NuevaVenta & { descuento_aplicado?: number | null }
  ): Promise<{ success: true; venta: VentaDB } | { success: false; error: string; details?: any }> => {
    try {
      const body = {
        id_usuario: payload.id_usuario == null ? null : Number(payload.id_usuario),
        detalles: Array.isArray(payload.detalles)
          ? payload.detalles.map((d) => ({ id_producto: Number(d.id_producto), cantidad: Number(d.cantidad) }))
          : [],
        pagado: Boolean(payload.pagado),
        ...(payload.descuento_aplicado != null ? { descuento_aplicado: Number(payload.descuento_aplicado) } : {}),
      };

      const resp = await api.post<CreateVentaResponse>('/ventas/ventaRealizada', body);
      const data = resp.data;

      if (!data) throw new Error('Respuesta inválida del servidor');
      if ((data as any).success === false) {
        const msg = data.message ?? data.error ?? 'Error al crear la venta';
        return { success: false, error: msg, details: (data as any).details ?? null };
      }

      const venta = (data as any).venta ?? data;
      if (!venta) return { success: false, error: 'No se recibió información de la venta' };

      if (venta.total !== undefined) {
        const n = parseNumberSafe(venta.total);
        if (n != null) venta.total = n;
      }
      if (venta.id_venta !== undefined) venta.id_venta = Number(venta.id_venta);

      return { success: true, venta: venta as VentaDB };
    } catch (err: any) {
      const resp = err?.response;
      const msg = resp?.data?.error ?? resp?.data?.message ?? err?.message ?? 'Error desconocido';
      return { success: false, error: String(msg) };
    }
  },

  fetchSampleVentaJson: async (path = '/data/venta.json'): Promise<any> => {
    if (typeof window === 'undefined') throw new Error('fetchSampleVentaJson solo disponible en cliente');
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  getAll: async (): Promise<VentaDB[]> => {
    try {
      const resp = await api.get<VentaDB[]>('/ventas/ventaRealizada');
      return resp.data ?? [];
    } catch (err) {
      console.error('Error obteniendo ventas:', err);
      return [];
    }
  },
};

export default ventasService;
