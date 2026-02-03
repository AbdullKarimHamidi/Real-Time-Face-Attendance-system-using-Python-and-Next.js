"use client"

import * as React from "react"
import { Pie, PieChart, Sector, Label, ResponsiveContainer } from "recharts"
import { type PieSectorDataItem } from "recharts/types/polar/Pie"

import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const desktopData = [
  { month: "january", desktop: 186 },
  { month: "february", desktop: 305 },
  { month: "march", desktop: 237 },
  { month: "april", desktop: 173 },
  { month: "may", desktop: 209 },
]

const chartConfig = {
  january: { label: "January", color: "var(--chart-1)" },
  february: { label: "February", color: "var(--chart-2)" },
  march: { label: "March", color: "var(--chart-3)" },
  april: { label: "April", color: "var(--chart-4)" },
  may: { label: "May", color: "var(--chart-5)" },
} satisfies ChartConfig

export function ChartPieInteractive() {
  const id = "pie-interactive"
  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month)

  const activeIndex = desktopData.findIndex(
    (item) => item.month === activeMonth
  )

  return (
    <Card className="relative h-50 w-60 overflow-hidden">
      <ChartStyle id={id} config={chartConfig} />

      {/* 🔹 TOP LEFT TITLE */}
      <div className="absolute top-2 left-2 text-xs font-medium">
        Visitors
      </div>

      {/* 🔹 TOP RIGHT SELECT */}
      <div className="absolute top-2 right-2">
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger className="h-6 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {desktopData.map((item) => (
              <SelectItem key={item.month} value={item.month}>
                {item.month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 🔹 CENTER CHART (FITS EXACTLY) */}
      <div className="absolute inset-0 pt-8">
        <ChartContainer id={id} config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={desktopData}
                dataKey="desktop"
                nameKey="month"
                innerRadius={35}
                outerRadius={60}
                strokeWidth={3}
                activeIndex={activeIndex}
                activeShape={(props: PieSectorDataItem) => (
                  <Sector {...props} outerRadius={props.outerRadius! + 5} />
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan className="fill-foreground text-lg font-bold">
                            {desktopData[activeIndex].desktop}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 14}
                            className="fill-muted-foreground text-[10px]"
                          >
                            Visitors
                          </tspan>
                        </text>
                      )
                    }
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
