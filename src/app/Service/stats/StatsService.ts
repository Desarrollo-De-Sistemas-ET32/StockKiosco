// app/Service/stats/StatsService.ts
import api from '../API';
import { StatsData, StatsApiResponse, normalizeStatsPayload } from './stats';

export const statsService = {

  getOverview: async (): Promise<{ success: true; data: StatsData } | { success: false; error: string; details?: any }> => {
    try {
      const resp = await api.get<StatsApiResponse>('/stats');
      const payload = resp.data;

      if (!payload) {
        return { success: false, error: 'Respuesta vacía del servidor' };
      }

  
      if (payload.ok === true && payload.data) {
        const normalized = normalizeStatsPayload(payload);
        return { success: true, data: normalized };
      }

    
      if (payload.error) {
        return { success: false, error: String(payload.error), details: payload.details ?? null };
      }

 
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
