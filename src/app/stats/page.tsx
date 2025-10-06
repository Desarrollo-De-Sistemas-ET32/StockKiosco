'use client'

import { 
  BiDollar,
  BiCartAlt,
  BiPackage,
  BiUser,
  BiTrendingUp,
  BiTimeFive,
} from "react-icons/bi";
import StatCard from "@/components/stat-card";
import { NavBar } from "@/components/navBar";
import TopCard from "@/components/top-cards";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  CardFooter,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart with dots"

const chartData = [
  { month: "Lunes", incomes: 18600},
  { month: "Martes", incomes: 30500},
  { month: "Miercoles", incomes: 23000},
  { month: "Jueves", incomes: 15000},
  { month: "Viernes", incomes: 30050},
  { month: "Sabado", incomes: 12700},
  { month: "Domingo", incomes: 1},

]

const chartConfig = {
  incomes: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-neutral-800 flex flex-col">
        <div className="flex items-center justify-center gap-10 py-3">
          <NavBar />
        </div>
      <div className="flex justify-center items-center flex-1 p-4">
        <div className="w-full max-w-7xl bg-[#2F363C] rounded-xl grid grid-rows-[auto_auto] gap-10 p-6 drop-shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Ingresos Totales"
                icon={<BiDollar className="size-7 text-white" />}
                data={`$ ` + 1247}
                percentage={10}
                description=""
                color="bg-linear-90 from-[#34A13B] to-[#009211]"
              />
            

              <StatCard
                title="Ventas Totales"
                icon={<BiCartAlt className="size-7 text-white" />}
                data={`324`}
                percentage={12}
                description=""
                color="bg-linear-90 from-[#FF6A2A] to-[#FF8F20]"
              />
            

              <StatCard
                title="Productos Vendidos"
                icon={<BiPackage className="size-7 text-white" />}
                data={`156`}
                percentage={8}
                description=""
                color="bg-linear-90 from-[#0077FF] to-[#4CCFFF]"
              />

              <StatCard
                title="Inventario total"
                icon={<BiUser className="size-7 text-white" />}
                data={`89`}
                percentage={3}
                description=""
                color="bg-linear-90 from-[#212529] to-[#343A40]"
              />

              <StatCard
                title="Inventario total"
                icon={<BiTrendingUp className="size-7 text-white" />}
                data={`$3.85`}
                percentage={31}
                description=""
                color="bg-linear-90 from-[#212529] to-[#343A40]"
              />

              <StatCard
                title="Inventario total"
                icon={<BiTimeFive className="size-7 text-white" />}
                data={`2:30 PM`}
                percentage={47}
                description=""
                color="bg-linear-90 from-[#212529] to-[#343A40]"
              />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full bg-linear-90 from-[#212529] to-[#343A40] rounded-xl p-5 flex flex-col">
              <p className="text-white p-2 font-bold">Productos Más Vendidos</p>
              <TopCard puesto={1} nombreProducto="Coca Cola 500ml" cantVendidos={145} precio={290} variacion={12} />
              <TopCard puesto={2} nombreProducto="Sándwich de Jamón" cantVendidos={89} precio={356} variacion={8} />
              <TopCard puesto={4} nombreProducto="Galletitas Oreo" cantVendidos={65} precio={130} variacion={5} />
              <TopCard puesto={5} nombreProducto="Agua Mineral" cantVendidos={54} precio={81} variacion={3} />
              <TopCard puesto={3} nombreProducto="Café Americano" cantVendidos={76} precio={152} variacion={15} />
            </div>

              <div className="w-full h-full bg-linear-90 from-[#212529] to-[#343A40] rounded-xl p-4 flex flex-col justify-between">
                <p className="text-white font-bold p-4">Ingresos Semanales</p>
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
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="incomes"
                      type="natural"
                      stroke="var(--neutrals)"
                      strokeWidth={2}
                      dot={{
                        fill: "var(--variant7)",
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ChartContainer>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="text-white leading-none pt-4 marker:text-white">
                    Mostrando la cantidad de Ingresos en la semana
                  </div>
                </CardFooter>
            </div>
          </div> 
        </div>
      </div>
    </main>
  );
}
