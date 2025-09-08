"use client"

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

let ventasMensuales = [
    100,50,32,18,30,200
]

const chartData = [
  { month: "Lunes", desktop: ventasMensuales[0], mobile: 80 },
  { month: "Martes", desktop: ventasMensuales[1], mobile: 200 },
  { month: "Miércoles", desktop: ventasMensuales[2], mobile: 120 },
  { month: "Jueves", desktop: ventasMensuales[3], mobile: 190 },
  { month: "Viernes", desktop: ventasMensuales[4], mobile: 130 },
  { month: "Sabadp", desktop: ventasMensuales[5], mobile: 140 },
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

export function ChartLineDots() {

  const [semana, setSemana] = useState<number | null>(null);

  useEffect(() => {
    const hoy = new Date();
    const numSemana = getWeekOfMonth(hoy, { weekStartsOn: 1 }); // lunes = inicio
    setSemana(numSemana);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>VENTAS SEMANALES</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
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
              content={<ChartTooltipContent hideLabel/>}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-foreground)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">Trending up by 5.2% this month<TrendingUp className="h-4 w-4" /></div>
        <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  )
}
