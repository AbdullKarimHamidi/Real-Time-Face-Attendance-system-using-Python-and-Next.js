"use client"

import * as React from "react"
import { Pie, PieChart, Sector, Label, ResponsiveContainer } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const data = [
  { month: "january", value: 186 },
  { month: "february", value: 305 },
  { month: "march", value: 237 },
  { month: "april", value: 173 },
  { month: "may", value: 209 },
]

const chartConfig = {
  january: { label: "January", color: "var(--chart-1)" },
  february: { label: "February", color: "var(--chart-2)" },
  march: { label: "March", color: "var(--chart-3)" },
  april: { label: "April", color: "var(--chart-4)" },
  may: { label: "May", color: "var(--chart-5)" },
} satisfies ChartConfig

export function ChartPieInteractive() {
  const id = "pie-beautiful"
  const [activeMonth, setActiveMonth] = React.useState(data[0].month)

  const activeIndex = data.findIndex(d => d.month === activeMonth)
  const activeValue = data[activeIndex].value

  return (
    <Card className="relative w-[320px] h-[260px] rounded-2xl p-4 shadow-md">
      <ChartStyle id={id} config={chartConfig} />

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold">Visitors</h3>
          <p className="text-xs text-muted-foreground">
            Monthly overview
          </p>
        </div>

        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger className="h-7 w-[110px] text-xs rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {data.map(item => (
              <SelectItem key={item.month} value={item.month}>
                {chartConfig[item.month].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ===== CHART ===== */}
      <div className="flex-1 flex items-center justify-center">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />

              <Pie
                data={data}
                dataKey="value"
                nameKey="month"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                activeIndex={activeIndex}
                activeShape={(props: PieSectorDataItem) => (
                  <Sector
                    {...props}
                    outerRadius={props.outerRadius! + 8}
                  />
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox)) return null
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan className="fill-foreground text-2xl font-bold">
                          {activeValue}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 18}
                          className="fill-muted-foreground text-xs"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}
