"use client"

import * as React from "react"
import { Pie, PieChart, Sector, Label, ResponsiveContainer, Cell } from "recharts"
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
import { Activity } from "lucide-react"

const data = [
  { month: "january", value: 186, fill: "url(#pieGradientBlue)" },
  { month: "february", value: 305, fill: "url(#pieGradientCyan)" },
  { month: "march", value: 237, fill: "url(#pieGradientBlue)" },
  { month: "april", value: 173, fill: "url(#pieGradientCyan)" },
  { month: "may", value: 209, fill: "url(#pieGradientBlue)" },
]

const chartConfig = {
  january: { label: "January", color: "#0ea5e9" },
  february: { label: "February", color: "#22d3ee" },
  march: { label: "March", color: "#2563eb" },
  april: { label: "April", color: "#0891b2" },
  may: { label: "May", color: "#3b82f6" },
} satisfies ChartConfig

export function ChartPieInteractive() {
  const id = "pie-beautiful"
  const [activeMonth, setActiveMonth] = React.useState(data[0].month)

  const activeIndex = data.findIndex(d => d.month === activeMonth)
  const activeValue = data[activeIndex].value

  return (
    <Card className="relative w-[350px] h-[320px] rounded-[2rem] p-6 bg-white dark:bg-[#020617] border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
      <ChartStyle id={id} config={chartConfig} />
      
      {/* Background Glow Decor */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

      {/* ===== HEADER ===== */}
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Data Node Alpha</span>
          </div>
          <Select value={activeMonth} onValueChange={setActiveMonth}>
            <SelectTrigger className="h-7 w-[100px] text-[10px] font-bold uppercase tracking-widest rounded-xl bg-slate-50 dark:bg-white/5 border-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-white/10">
              {data.map(item => (
                <SelectItem key={item.month} value={item.month} className="text-[10px] font-bold uppercase">
                  {chartConfig[item.month as keyof typeof chartConfig].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <h2 className="text-xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
          Traffic.<span className="text-cyan-500">Share</span>
        </h2>
      </div>

      {/* ===== CHART ===== */}
      <div className="h-[180px] w-full relative">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="pieGradientBlue" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="pieGradientCyan" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0e7490" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="rounded-xl border-none shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md" />}
              />

              <Pie
                data={data}
                dataKey="value"
                nameKey="month"
                innerRadius={60}
                outerRadius={80}
                stroke="none"
                paddingAngle={5}
                activeIndex={activeIndex}
                activeShape={(props: PieSectorDataItem) => (
                  <g>
                    <Sector
                      {...props}
                      outerRadius={props.outerRadius! + 10}
                      className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                    />
                    <Sector
                      {...props}
                      innerRadius={props.innerRadius! - 4}
                      outerRadius={props.innerRadius!}
                      fill="#22d3ee"
                    />
                  </g>
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
                        <tspan className="fill-slate-400 text-[10px] font-black uppercase tracking-widest" x={viewBox.cx} dy="-10">
                          Total
                        </tspan>
                        <tspan className="fill-slate-900 dark:fill-white text-3xl font-black italic tracking-tighter" x={viewBox.cx} dy="25">
                          {activeValue}
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

      {/* FOOTER STATS */}
      <div className="mt-4 flex justify-between items-center border-t border-slate-100 dark:border-white/5 pt-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stability</span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase">99.8% Sync</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
            <span className="text-[10px] font-bold text-cyan-500 uppercase italic">SHA-256</span>
          </div>
      </div>
    </Card>
  )
}