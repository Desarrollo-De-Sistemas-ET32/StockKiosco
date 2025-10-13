// src/app/Service/logs/LogService.ts
import api from "../API";

export type Log = {
  fecha: string;
  usuario: string;
  accion: string;
  producto?: string;
  cantidad?: number;
  ip?: string;
  hora?: string;
};

const LogService = {
  /**
   * Intenta obtener logs desde el backend via /api/logs
   * Si falla (404 / no server), intenta cargar /logs/logs.json (static file).
   */
  getLogs: async (): Promise<Log[]> => {
    // 1) Intentar endpoint backend (usa baseURL de api, p.ej. http://localhost:3001/api)
    try {
      const res = await api.get("/logs");
      const data = res.data;
      // Normalizar: si viene { logs: [...] } o directamente [...]
      if (Array.isArray(data)) return data as Log[];
      if (Array.isArray(data.logs)) return data.logs as Log[];
      // si viene en wrapper distinto, intenta devolver lo que parezca array
      const maybeArray = Object.values(data).find((v) => Array.isArray(v));
      if (Array.isArray(maybeArray)) return maybeArray as Log[];
      // fallback a data (siempre que sea array)
      return Array.isArray(data) ? data : [];
    } catch (err) {
      // 2) Fallback a static file en /logs/logs.json (public/logs/logs.json)
      try {
        const fallback = await fetch("/logs/logs.json");
        if (!fallback.ok) {
          console.warn("LogService: fallback /logs/logs.json failed", fallback.status);
          return [];
        }
        const j = await fallback.json();
        return Array.isArray(j) ? j : (j.logs ?? []);
      } catch (err2) {
        console.error("LogService fallback read error:", err2);
        return [];
      }
    }
  },
};

export default LogService;
