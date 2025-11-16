// app/Service/stats/stats.ts

export type WeeklyIncomeItem = {
  fecha: string; // "YYYY-MM-DD"
  total: number;
};

export type TopProductItem = {
  id_producto?: number | null;
  nombre?: string | null;
  precio: number;
  cantidad_vendida: number;
};

export type StatsData = {
  ingresosTotales: number;
  ventasTotales: number;
  productosVendidos: number;
  ingresosSemanales?: WeeklyIncomeItem[]; // array asc ordenado por fecha (lo que devuelve el action)
  productosVendidosDetalle?: TopProductItem[]; // array ordenado por ventas (lo que devuelve el action)
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

export function parseNumberSafe(v: any): number {
  if (v == null) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Normaliza la carga del endpoint /stats a un StatsData consistente.
 * Soporta varias formas (payload directo, payload.data, etc.)
 */
export function normalizeStatsPayload(payload: any): StatsData {
  const root = payload?.data ?? payload ?? {};

  const ingresosTotales = parseNumberSafe(root.ingresosTotales ?? root.totalIngresos ?? root.ingresos ?? 0);
  const ventasTotales = parseNumberSafe(root.ventasTotales ?? root.totalVentas ?? root.ventas ?? 0);
  const productosVendidos = parseNumberSafe(root.productosVendidos ?? root.totalProductos ?? root.productos ?? 0);

  const ingresosSemanalesRaw: any[] = Array.isArray(root.ingresosSemanales) ? root.ingresosSemanales : Array.isArray(root.ingresos_semanales) ? root.ingresos_semanales : [];
  const ingresosSemanales = ingresosSemanalesRaw.map((i: any) => ({
    fecha: String(i.fecha ?? i.fecha_venta ?? i.date ?? ""),
    total: parseNumberSafe(i.total ?? i._sum?.total ?? i.monto ?? 0),
  }));

  const productosVendidosDetalleRaw: any[] = Array.isArray(root.productosVendidosDetalle)
    ? root.productosVendidosDetalle
    : Array.isArray(root.productos_vendidos_detalle)
    ? root.productos_vendidos_detalle
    : Array.isArray(root.detalleProductos)
    ? root.detalleProductos
    : [];

  const productosVendidosDetalle = productosVendidosDetalleRaw.map((p: any) => ({
    id_producto: p.id_producto ?? p.id ?? null,
    nombre: p.nombre ?? p.title ?? null,
    precio: parseNumberSafe(p.precio ?? p.price ?? 0),
    cantidad_vendida: parseNumberSafe(p.cantidad_vendida ?? p.cantidad_vendida ?? p.qty ?? p._sum?.cantidad ?? 0),
  }));

  return {
    ingresosTotales,
    ventasTotales,
    productosVendidos,
    ingresosSemanales: ingresosSemanales.length ? ingresosSemanales : undefined,
    productosVendidosDetalle: productosVendidosDetalle.length ? productosVendidosDetalle : undefined,
  };
}
