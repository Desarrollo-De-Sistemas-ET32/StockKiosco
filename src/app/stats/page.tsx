"use client";

import {
  BiDollar,
  BiCartAlt,
  BiPackage,
  BiUser,
  BiTrendingUp,
  BiTimeFive,
} from "react-icons/bi";
import StatCard from "@/components/stat-card";
import TopCard from "@/components/top-cards";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import statsService from "@/app/Service/stats/StatsService";

export const description = "A line chart with dots";

const chartData = [
  { month: "Lunes", incomes: 18600 },
  { month: "Martes", incomes: 30500 },
  { month: "Miercoles", incomes: 23000 },
  { month: "Jueves", incomes: 15000 },
  { month: "Viernes", incomes: 30050 },
  { month: "Sabado", incomes: 12700 },
  { month: "Domingo", incomes: 1 },
];

let productos = [
  { nombre: "Coca Cola Original 600 mL", precio: 1700, cantVentas: 3000 },
  { nombre: "Chocolate Rhodesia", precio: 1100, cantVentas: 500 },
  {
    nombre: "Alfajor de Chocolate c/Frutilla Barrigon 100g",
    precio: 2300,
    cantVentas: 1200,
  },
  { nombre: "Alfajor Negro", precio: 1500, cantVentas: 2 },
];

productos.sort((a, b) => b.cantVentas - a.cantVentas);

const chartConfig = {
  incomes: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const [stats, setStats] = useState<{
    ingresosTotales: number;
    ventasTotales: number;
    productosVendidos: number;
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const res = await statsService.getOverview();
        if (!mounted) return;
        if (res.success) {
          setStats(res.data);
        } else {
          setStats(null);
          setStatsError(res.error ?? "Error al obtener estadísticas");
        }
      } catch (err: any) {
        setStats(null);
        setStatsError(err?.message ?? "Error desconocido");
      } finally {
        if (mounted) setLoadingStats(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const fmtCurrency = (n: number) =>
    typeof n === "number" ? `$ ${n.toFixed(2)}` : "$ 0.00";

  return (
    <div className="flex justify-center items-center flex-1">
      <div className="w-full max-w-7xl bg-light-60 dark:bg-dark-60 rounded-xl grid grid-rows-[auto_auto] gap-10 p-6 drop-shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Ingresos Totales"
            icon={<BiDollar className="size-7 text-white" />}
            data={
              loadingStats
                ? "Cargando..."
                : stats
                ? fmtCurrency(stats.ingresosTotales)
                : "—"
            }
            percentage={10}
            description={statsError ?? ""}
            color="bg-confirm"
          />

          <StatCard
            title="Ventas Totales"
            icon={<BiCartAlt className="size-7 text-white" />}
            data={loadingStats ? "Cargando..." : stats ? `${stats.ventasTotales}` : "—"}
            percentage={12}
            description=""
            color="bg-random"
          />

          <StatCard
            title="Productos Vendidos"
            icon={<BiPackage className="size-7 text-white" />}
            data={loadingStats ? "Cargando..." : stats ? `${stats.productosVendidos}` : "—"}
            percentage={8}
            description=""
            color="bg-neutral"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full bg-light-30 dark:bg-dark-30 rounded-xl p-5 flex flex-col gap-2">
            <p className="dark:text-white p-2 font-bold">
              Productos Más Vendidos
            </p>
            {productos.map((p) => (
              <TopCard
                key={p.nombre}
                nombreProducto={p.nombre}
                cantVendidos={p.cantVentas}
                precio={p.precio}
              ></TopCard>
            ))}
          </div>

          <div className="w-full h-full dark:bg-dark-30 bg-light-30 rounded-xl p-4 flex flex-col justify-between">
            <p className="dark:text-white font-bold p-4">Ingresos Semanales</p>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="incomes"
                  type="natural"
                  stroke="var(--positive)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--dark-10)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
