// app/Service/stats/stats.ts

export type StatsData = {
  ingresosTotales: number;
  ventasTotales: number;
  productosVendidos: number;
};

export type StatsApiOk = {
  ok: true;
  data: StatsData;
};

export type StatsApiError = {
  ok?: false;
  error: string;
  details?: any;
};

export type StatsApiResponse = StatsApiOk | StatsApiError | Record<string, any>;

/** convierte valores no numéricos a número seguro */
export function parseNumberSafe(v: any): number {
  if (v == null) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Normaliza un payload posible a StatsData */
export function normalizeStatsPayload(payload: any): StatsData {
  const root = payload?.data ?? payload;
  return {
    ingresosTotales: parseNumberSafe(root.ingresosTotales ?? root.totalIngresos ?? root.ingresos ?? 0),
    ventasTotales: parseNumberSafe(root.ventasTotales ?? root.totalVentas ?? root.ventas ?? 0),
    productosVendidos: parseNumberSafe(root.productosVendidos ?? root.totalProductos ?? root.productos ?? 0),
  };
}
