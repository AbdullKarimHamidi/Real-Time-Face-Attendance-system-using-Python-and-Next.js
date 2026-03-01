"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

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
    color: "#0ea5e9", // Primary Blue
  },
  mobile: {
    label: "Mobile",
    color: "#22d3ee", // Secondary Cyan
  },
} satisfies ChartConfig

export function ChartBarMultiple() {
  return (
    <div className="w-full h-full flex flex-col p-6 bg-white dark:bg-[#020617] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl">
      
      {/* ===== HEADER SECTION ===== */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
            Traffic.<span className="text-cyan-500">Analytics</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Active Nodes</p>
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="min-h-[300px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={12}
          >
            {/* SVG Gradient Definitions matching the image */}
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={1} />
                <stop offset="100%" stopColor="#0891b2" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              vertical={false} 
              strokeDasharray="4 4" 
              className="stroke-slate-200 dark:stroke-white/5" 
            />
            
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={15}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-[11px] font-black uppercase tracking-widest fill-slate-400"
            />

            <YAxis 
               tickLine={false} 
               axisLine={false} 
               className="text-[11px] font-bold fill-slate-400"
            />

            <ChartTooltip
              cursor={{ fill: 'rgba(14, 165, 233, 0.05)', radius: 10 }}
              content={<ChartTooltipContent indicator="dashed" />}
            />

            <Legend 
              verticalAlign="top" 
              align="right"
              content={({ payload }) => (
                <div className="flex gap-6 justify-end mb-8">
                  {payload?.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: entry.color }} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />

            <Bar 
              dataKey="desktop" 
              fill="url(#blueGradient)" 
              radius={[8, 8, 0, 0]} 
              barSize={32}
              className="filter drop-shadow-[0_10px_10px_rgba(14,165,233,0.1)] hover:brightness-110 transition-all cursor-pointer"
            />

            <Bar 
              dataKey="mobile" 
              fill="url(#cyanGradient)" 
              radius={[8, 8, 0, 0]} 
              barSize={32}
              className="filter drop-shadow-[0_10px_10px_rgba(34,211,238,0.1)] hover:brightness-110 transition-all cursor-pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* FOOTER INFO MOVED FROM IMAGE DESIGN */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Protocol v4.2</span>
        <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Verified Data Stream</span>
      </div>
    </div>
  )
}