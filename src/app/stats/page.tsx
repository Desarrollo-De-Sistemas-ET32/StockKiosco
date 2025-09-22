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

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart with dots"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function StatsPage() {
  return (
    <main className="flex h-[80rem] bg-blend-darken justify-center items-center bg-neutral-800">
      <div className="w-5/6 h-9/12 bg-[#2F363C] rounded-xl grid grid-rows-[auto_auto] gap-10 p-8 drop-shadow-xl/50">
        <div className="grid grid-cols-3 gap-10">
          <div className="bg-linear-90 from-white to-black p-[1px] rounded-xl drop-shadow-lg/25">
            <StatCard
            title="Ingresos Totales"
            icon={<BiDollar className="size-7 text-white" />}
            data={`$ ` + 1247}
            percentage={10}
            description=""
            color="bg-linear-90 from-[#34A13B] to-[#009211]"
            />
          </div>
        

          <div className="bg-linear-90 from-white to-black p-[1px] rounded-xl drop-shadow-lg/25">
            <StatCard
              title="Ventas Totales"
              icon={<BiCartAlt className="size-7 text-white" />}
              data={`324`}
              percentage={12}
              description=""
              color="bg-linear-90 from-[#FF6A2A] to-[#FF8F20]"
            />
          </div>

          <div className="bg-linear-90 from-white to-black p-[1px] rounded-xl drop-shadow-lg/25">
            <StatCard
              title="Productos Vendidos"
              icon={<BiPackage className="size-7 text-white" />}
              data={`156`}
              percentage={8}
              description=""
              color="bg-linear-90 from-[#0077FF] to-[#4CCFFF]"
            />
          </div>


          <div className="bg-linear-90 from-white to-black p-[1px] rounded-xl drop-shadow-lg/25">
            <StatCard
              title="Inventario total"
              icon={<BiUser className="size-7 text-white" />}
              data={`89`}
              percentage={3}
              description=""
              color="bg-linear-90 from-[#212529] to-[#343A40]"
            />
          </div>


          <div className="bg-linear-90 from-white to-black p-[1px] rounded-xl drop-shadow-lg/25">
            <StatCard
              title="Inventario total"
              icon={<BiTrendingUp className="size-7 text-white" />}
              data={`$3.85`}
              percentage={31}
              description=""
              color="bg-linear-90 from-[#212529] to-[#343A40]"
            />
          </div>

          <div className="bg-linear-90 from-white to-black p-[1px] rounded-xl drop-shadow-lg/25">
            <StatCard
              title="Inventario total"
              icon={<BiTimeFive className="size-7 text-white" />}
              data={`2:30 PM`}
              percentage={47}
              description=""
              color="bg-linear-90 from-[#212529] to-[#343A40]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="h-[50vh] bg-linear-90 from-white to-black p-[1px] rounded-xl drop-shadow-lg/25">
            <div className="h-full w-full bg-linear-90 from-[#212529] to-[#343A40] rounded-xl p-5 flex flex-col justify-center">
              <p className="text-white p-2 font-bold">Productos Más Vendidos</p>
              <TopCard puesto={1} nombreProducto="Coca Cola 500ml" cantVendidos={145} precio={290} variacion={12} />
              <TopCard puesto={2} nombreProducto="Sándwich de Jamón" cantVendidos={89} precio={356} variacion={8} />
              <TopCard puesto={4} nombreProducto="Galletitas Oreo" cantVendidos={65} precio={130} variacion={5} />
              <TopCard puesto={5} nombreProducto="Agua Mineral" cantVendidos={54} precio={81} variacion={3} />
              <TopCard puesto={3} nombreProducto="Café Americano" cantVendidos={76} precio={152} variacion={15} />
            </div>
          </div>
            
          <div className="h-[50vh] bg-linear-90 from-white to-black p-[1px] rounded-xl drop-shadow-lg/25">
            <div className="h-full w-full bg-linear-90 from-[#212529] to-[#343A40] rounded-xl p-4">
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
                  dataKey="desktop"
                  type="natural"
                  stroke="var(--variant7)"
                  strokeWidth={2}
                  dot={{
                  fill: "var(--variant7 )",
                  }}
                  activeDot={{
                  r: 6,
                  }}
                />
                </LineChart>
              </ChartContainer>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium text-white">
                 Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-white leading-none">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </div>
          </div>
        </div> 
      </div>
    </main>
  );
}
