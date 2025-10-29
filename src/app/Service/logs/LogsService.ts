// app/Service/logs/LogsService.ts
import api from '../API';
import type { Log } from './logs';
import { mapRawToLog } from './logs';

export const logService = {
  /**
   * GET /api/logs/readLogs
   * Devuelve array normalizado Log[]
   */
  getAll: async (): Promise<Log[]> => {
    try {
      const resp = await api.get('/logs/readLogs');
      const data = resp.data as any;

      let rawLogs: any[] = [];

      if (!data) {
        rawLogs = [];
      } else if (Array.isArray(data)) {
        rawLogs = data;
      } else if (Array.isArray(data.logs)) {
        rawLogs = data.logs;
      } else if (Array.isArray(data.data)) {
        rawLogs = data.data;
      } else if (data.log && typeof data.log === 'object') {
        rawLogs = [data.log];
      } else {
        // fallback: tomar primer array encontrado dentro del objeto
        const keys = Object.keys(data ?? {});
        for (const k of keys) {
          if (Array.isArray((data as any)[k])) {
            rawLogs = (data as any)[k];
            break;
          }
        }
        // último recurso: si es objeto con registros indexados (valores array)
        if (rawLogs.length === 0 && typeof data === 'object') {
          const vals = Object.values(data);
          if (vals.length > 0 && Array.isArray(vals[0])) rawLogs = vals[0] as any[];
        }
      }

      const normalized = rawLogs.map((r: any) => mapRawToLog(r));

      // ordenar por fecha descendente (siempre que haya fecha)
      normalized.sort((a, b) => {
        const ta = a.fecha ? new Date(a.fecha).getTime() : 0;
        const tb = b.fecha ? new Date(b.fecha).getTime() : 0;
        return tb - ta;
      });

      return normalized;
    } catch (error: any) {
      console.error('logService.getAll error:', error);
      const message =
        error?.response?.data?.error ??
        error?.response?.data ??
        error?.message ??
        'Error al obtener logs';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  getRecent: async (limit = 10): Promise<Log[]> => {
    const all = await logService.getAll();
    return all.slice(0, limit);
  },
};

export default logService;
