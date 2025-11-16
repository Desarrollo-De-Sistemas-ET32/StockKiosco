// app/Service/stats/StatsService.ts
import api from '../API';
import type { StatsData, StatsApiResponse } from './stats';
import { normalizeStatsPayload } from './stats';

export const statsService = {
  /**
   * Llama a GET /stats y devuelve { success: true, data } o { success:false, error }
   */
  getOverview: async (): Promise<{ success: true; data: StatsData } | { success: false; error: string; details?: any }> => {
    try {
      const resp = await api.get<StatsApiResponse>('/stats');
      const payload = resp.data;

      if (!payload) {
        return { success: false, error: 'Respuesta vacía del servidor' };
      }

      // Si el action devolvió la forma { ok: true, data: { ... } }
      if ((payload as any).ok === true && (payload as any).data) {
        const normalized = normalizeStatsPayload(payload);
        return { success: true, data: normalized };
      }

      // Si devolvió error
      if ((payload as any).ok === false || (payload as any).error) {
        const msg = (payload as any).error ?? (payload as any).message ?? 'Error en la respuesta del servidor';
        return { success: false, error: String(msg), details: (payload as any).details ?? null };
      }

      // Fallback: intentar normalizar payload directo
      const normalizedFallback = normalizeStatsPayload(payload);
      return { success: true, data: normalizedFallback };
    } catch (err: any) {
      const resp = err?.response;
      if (resp?.data) {
        const server = resp.data;
        const msg = server?.error ?? server?.message ?? JSON.stringify(server);
        const details = server?.details ?? server?.errors ?? null;
        return { success: false, error: String(msg), details };
      }
      return { success: false, error: err?.message ?? String(err) };
    }
  },
};

export default statsService;
