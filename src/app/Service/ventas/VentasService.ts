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
  /**
   * Crea una venta en el backend.
   * - endpoint: POST /api/ventas/ventaRealizada  (API.ts ya tiene baseURL '/api')
   *
   * Devuelve el objeto normalizado o lanza un Error con mensaje legible.
   */
  create: async (payload: NuevaVenta): Promise<{ success: true; venta: VentaDB } | { success: false; error: string; details?: any }> => {
    try {
      // Normalizar ids / tipos mínimos
      const body = {
        ...payload,
        id_usuario: payload.id_usuario == null ? null : Number(payload.id_usuario),
        detalles: Array.isArray(payload.detalles)
          ? payload.detalles.map((d) => ({ id_producto: Number(d.id_producto), cantidad: Number(d.cantidad) }))
          : [],
        pagado: Boolean(payload.pagado),
      };

      const resp = await api.post<CreateVentaResponse>('/ventas/ventaRealizada', body);
      const data = resp.data;

      // Si backend usa success:false
      if (data == null) throw new Error('Respuesta inválida del servidor');

      if ((data as any).success === false) {
        const msg = data.message ?? data.error ?? 'Error al crear la venta';
        return { success: false, error: msg, details: (data as any).details ?? (data as any).errors ?? null };
      }

      // si backend devolvió error de forma { error: '...' }
      if ((data as any).error) {
        const msg = (data as any).error ?? 'Error al crear la venta';
        return { success: false, error: msg, details: (data as any).details ?? null };
      }

      // Normalizar total/ids en la venta devuelta
      const venta = (data as any).venta ?? (data as any).venta ?? data;
      if (!venta) return { success: false, error: 'No se recibió información de la venta' };

      // asegurar tipos numéricos en campos clave
      if (venta.total !== undefined) {
        const n = parseNumberSafe(venta.total);
        if (n != null) venta.total = n;
      }
      if (venta.id_venta !== undefined) venta.id_venta = Number(venta.id_venta);

      return { success: true, venta: venta as VentaDB };
    } catch (err: any) {
      // intentar extraer info de axios
      const resp = err?.response;
      if (resp?.data) {
        const server = resp.data;
        const msg = server?.error ?? server?.message ?? JSON.stringify(server);
        const details = server?.details ?? server?.errors ?? null;
        return { success: false, error: String(msg), details };
      }
      const msg = err?.message ?? String(err) ?? 'Error desconocido';
      return { success: false, error: msg };
    }
  },

  /**
   * Función helper para obtener el JSON local de ejemplo usado en la vista.
   * (la vista lo buscaba con fetch('/data/venta.json'))
   */
  fetchSampleVentaJson: async (path = '/data/venta.json'): Promise<any> => {
    if (typeof window === 'undefined') throw new Error('fetchSampleVentaJson sólo está disponible en cliente');
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching sample venta JSON:', err);
      throw err;
    }
  },
};

export default ventasService;
