// src/app/stats/page.tsx
"use client";

import { BiDollar, BiCartAlt, BiPackage } from "react-icons/bi";
import StatCard from "@/components/stat-card";
import TopCard from "@/components/top-cards";
import { CartesianGrid, LineChart, XAxis, Line as ReLine } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import statsService from "@/app/Service/stats/StatsService";
import { productoService } from "@/app/Service/producto/ProductoService";
import ventasService from "@/app/Service/ventas/VentasService";

export const description = "A line chart with dots";

const chartConfig = {
  incomes: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type TopProduct = {
  nombre: string;
  precio: number;
  cantVendidos: number;
};

export default function StatsPage() {
  const [stats, setStats] = useState<{
    ingresosTotales: number;
    ventasTotales: number;
    productosVendidos: number;
  } | null>(null);

  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [weeklyIncomes, setWeeklyIncomes] = useState<Array<{ label: string; incomes: number }>>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // helper: obtener abreviatura en español y DD/MM opcional
  const formatDateLabel = (isoOrDate: string | Date) => {
    try {
      const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
      if (isNaN(d.getTime())) return String(isoOrDate);
      const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
      const dayAbbr = days[d.getDay()];
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      return `${dayAbbr} ${dd}/${mm}`;
    } catch {
      return String(isoOrDate);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // preferir endpoints del statsService si existen
        const [ovRes, topRes, weekRes] = await Promise.all([
          statsService.getOverview(),
          typeof statsService.getTopProducts === "function"
            ? statsService.getTopProducts()
            : { success: false },
          typeof statsService.getWeeklyIncomes === "function"
            ? statsService.getWeeklyIncomes()
            : { success: false },
        ]);

        if (!mounted) return;

        // Overview
        if (ovRes?.success) {
          setStats(ovRes.data);
        } else {
          setStats(null);
        }

        // Top products: si el servicio lo provee, úsalo; si no, fallback con productoService + ventasService
        if (topRes?.success) {
          const normalized = (topRes.data ?? []).map((p: any) => ({
            nombre: p.nombre ?? p.name ?? String(p.producto ?? p.title ?? "Producto"),
            precio: Number(p.precio ?? p.price ?? 0),
            cantVendidos: Number(p.cantVendidos ?? p.cantidad_vendida ?? p.qty ?? 0),
          })) as TopProduct[];
          setTopProducts(normalized.slice(0, 10));
        } else {
          // FALLBACK: calcular top usando productos + ventas
          try {
            const [productos, ventas] = await Promise.all([productoService.getAll(), ventasService.getAll()]);
            const prodMap = new Map<number, { nombre: string; precio: number }>();
            productos.forEach((p: any) => {
              const id = Number(p.id_producto ?? p.id ?? 0);
              prodMap.set(id, {
                nombre: String(p.nombre ?? p.title ?? `Producto ${id}`),
                precio: Number(p.precio ?? 0),
              });
            });

            const soldCount: Record<number, number> = {};
            (ventas ?? []).forEach((v: any) => {
              const detalles = v.detalles ?? v.detalles_venta ?? v.detallesVenta ?? [];
              if (!Array.isArray(detalles)) return;
              detalles.forEach((d: any) => {
                const idp = Number(d.id_producto ?? d.idProducto ?? d.producto_id ?? 0);
                const qty = Number(d.cantidad ?? d.qty ?? d.cantidad_vendida ?? 0);
                if (!idp) return;
                soldCount[idp] = (soldCount[idp] || 0) + (Number.isFinite(qty) ? qty : 0);
              });
            });

            const arr: TopProduct[] = [];
            for (const [id, info] of prodMap.entries()) {
              const qty = soldCount[id] ?? 0;
              if (qty > 0) {
                arr.push({ nombre: info.nombre, precio: info.precio, cantVendidos: qty });
              }
            }
            arr.sort((a, b) => b.cantVendidos - a.cantVendidos);
            setTopProducts(arr.slice(0, 10));
          } catch (err) {
            console.warn("Fallo fallback topProducts:", err);
            setTopProducts([]);
          }
        }

        // Weekly incomes: preferir service, fallback con ventasService
        if (weekRes?.success) {
          const normalizedWeek = (weekRes.data ?? []).map((r: any) => ({
            label: String(r.label ?? r.day ?? r.month ?? r.nombre ?? formatDateLabel(r.fecha ?? r.date ?? "")),
            incomes: Number(r.incomes ?? r.total ?? r.monto ?? 0),
          }));
          setWeeklyIncomes(normalizedWeek);
        } else {
          try {
            const ventas = await ventasService.getAll();
            // preparar acumulador por día (Lun..Dom)
            const dayOrder = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
            const dayMap: Record<string, number> = {
              Lun: 0,
              Mar: 0,
              Mie: 0,
              Jue: 0,
              Vie: 0,
              Sab: 0,
              Dom: 0,
            };

            (ventas ?? []).forEach((v: any) => {
              const raw = v.fecha_venta ?? v.fecha ?? v.fecha_creacion ?? v.fechaCreacion ?? null;
              const total = Number(v.total ?? v.monto ?? 0);
              if (!raw) return;
              const d = new Date(raw);
              if (isNaN(d.getTime())) return;
              const dow = d.getDay(); // 0..6 (Dom..Sab)
              const label = dow === 0 ? "Dom" : dayOrder[dow - 1];
              dayMap[label] = (dayMap[label] || 0) + (Number.isFinite(total) ? total : 0);
            });

            const normalizedWeek = dayOrder.map((lbl) => ({ label: lbl, incomes: dayMap[lbl] ?? 0 }));
            setWeeklyIncomes(normalizedWeek);
          } catch (err) {
            console.warn("Fallo fallback weeklyIncomes:", err);
            setWeeklyIncomes([]);
          }
        }
      } catch (err: any) {
        console.error("Error cargando estadísticas:", err);
        setError(err?.message ?? "Error al cargar estadísticas");
        setStats(null);
        setTopProducts([]);
        setWeeklyIncomes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const anyDataAvailable =
    Boolean(stats) ||
    (Array.isArray(topProducts) && topProducts.length > 0) ||
    (Array.isArray(weeklyIncomes) && weeklyIncomes.length > 0);

  const fmtCurrency = (n: number) =>
    typeof n === "number" ? `$ ${n.toFixed(2)}` : "$ 0.00";

  const chartData = weeklyIncomes.map((r) => ({ month: r.label, incomes: r.incomes }));

  if (!loading && !anyDataAvailable) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-lg font-medium">No hay datos disponibles</p>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-1">
      <div className="w-full max-w-7xl bg-light-60 dark:bg-dark-60 rounded-xl grid grid-rows-[auto_auto] gap-10 p-6 drop-shadow-xl">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Ingresos Totales"
            icon={<BiDollar className="size-7 text-white" />}
            data={loading ? "Cargando..." : stats ? fmtCurrency(stats.ingresosTotales) : "—"}
            percentage={0}
            description={error ?? ""}
            color="bg-confirm"
          />

          <StatCard
            title="Ventas Totales"
            icon={<BiCartAlt className="size-7 text-white" />}
            data={loading ? "Cargando..." : stats ? `${stats.ventasTotales}` : "—"}
            percentage={0}
            description=""
            color="bg-random"
          />

          <StatCard
            title="Productos Vendidos"
            icon={<BiPackage className="size-7 text-white" />}
            data={loading ? "Cargando..." : stats ? `${stats.productosVendidos}` : "—"}
            percentage={0}
            description=""
            color="bg-neutral"
          />
        </div>

        {/* Top products + Weekly incomes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top products */}
          <div className="w-full bg-light-30 dark:bg-dark-30 rounded-xl p-5 flex flex-col gap-2">
            <p className="dark:text-white p-2 font-bold">Productos Más Vendidos</p>

            {loading && <p className="text-sm text-muted-foreground">Cargando...</p>}

            {!loading && topProducts.length > 0 && (
              <>
                {topProducts.map((p) => (
                  <TopCard
                    key={p.nombre}
                    nombreProducto={p.nombre}
                    cantVendidos={p.cantVendidos}
                    precio={p.precio}
                  />
                ))}
              </>
            )}

            {!loading && topProducts.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">No hay datos de productos vendidos</p>
            )}
          </div>

          {/* Weekly incomes */}
          <div className="w-full h-full dark:bg-dark-30 bg-light-30 rounded-xl p-4 flex flex-col justify-between">
            <p className="dark:text-white font-bold p-4">Ingresos Semanales</p>

            {loading && <p className="text-sm text-muted-foreground p-4">Cargando...</p>}

            {!loading && chartData.length > 0 && (
              <ChartContainer config={chartConfig}>
                <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={true} tickMargin={8} />
                  <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
                  <ReLine
                    dataKey="incomes"
                    type="natural"
                    stroke="var(--positive)"
                    strokeWidth={3}
                    dot={{ fill: "var(--dark-10)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            )}

            {!loading && chartData.length === 0 && (
              <p className="text-sm text-muted-foreground mt-3">No hay datos semanales disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
