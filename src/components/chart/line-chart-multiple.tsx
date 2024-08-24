"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

const chartData = [
  { month: "January", online_store: 186, point_of_sales: 80 },
  { month: "February", online_store: 305, point_of_sales: 200 },
  { month: "March", online_store: 237, point_of_sales: 120 },
  { month: "April", online_store: 73, point_of_sales: 190 },
  { month: "May", online_store: 209, point_of_sales: 130 },
  { month: "June", online_store: 214, point_of_sales: 140 },
]

const chartConfig = {
  online_store: {
    label: "Online store",
    color: "hsl(var(--chart-1))",
  },
  point_of_sales: {
    label: "Point of sales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function Component() {
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription> */}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="online_store"
              type="monotone"
              stroke="var(--color-online_store)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="point_of_sales"
              type="monotone"
              stroke="var(--color-point_of_sales)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter> */}
        {/* <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div> */}
      {/* </CardFooter> */}
    </Card>
  )
}
