"use client";

import { ChartPieInteractive } from "@/components/Chart";
import { ChartBarMultiple } from "@/components/PieChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Activity, ShieldCheck, User, Users, Target, Radio, Maximize2, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";

const Provinces = [
  { name: "Herat", color: "bg-cyan-500" },
  { name: "Kabul", color: "bg-emerald-500" },
  { name: "Mazar", color: "bg-amber-500" },
];

const Employees = [
  { name: "Jack", status: "present", check_in: "08:12 AM", check_out: "04:30 PM" },
  { name: "Ahmad", status: "present", check_in: "07:55 AM", check_out: "04:30 PM" },
  { name: "Karim", status: "absent", check_in: "--:--", check_out: "--:--" },
];

export default function DashboardCard() {
  const [province, setProvince] = useState("Herat");
  const [countEngineers, setCountEngineers] = useState('0');
  const [presentedEMps, setPresentedEmps] = useState('0');
  const [upsents, setUpsent] = useState('0');

  const fetchCount = async () => {
    try {
      const resp = await fetch("http://localhost:8000/countall");
      const data = await resp.json();
      setCountEngineers(data.AllEngineers);
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    try {
      const res1 = await fetch('http://localhost:8000/presentedEmps');
      const data1 = await res1.json();
      setPresentedEmps(data1.message);

      const res2 = await fetch('http://localhost:8000/upsentEmps');
      const data2 = await res2.json();
      setUpsent(data2.upsentEmp);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchCount();
    fetchData();
  }, []);

  return (
    <div className="w-full space-y-6 px-4 py-4 bg-slate-50 dark:bg-transparent min-h-screen">
      
      {/* ===== TOP TECHNICAL STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Network Registry", val: countEngineers, icon: <Users className="w-4 h-4" />, color: "text-blue-500", glow: "bg-blue-500/10" },
          { title: "Active Nodes", val: presentedEMps, icon: <ShieldCheck className="w-4 h-4" />, color: "text-emerald-500", glow: "bg-emerald-500/10" },
          { title: "Offline Links", val: upsents, icon: <User className="w-4 h-4" />, color: "text-red-500", glow: "bg-red-500/10" },
          { title: "System Latency", val: "12ms", icon: <Zap className="w-4 h-4" />, color: "text-amber-500", glow: "bg-amber-500/10" },
        ].map((item, i) => (
          <Card key={i} className="border-none bg-white dark:bg-white/5 rounded-[1.5rem] shadow-sm overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-1 h-full ${item.color.replace('text', 'bg')}`} />
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.title}</p>
                <h2 className="text-2xl font-black italic tracking-tighter">{item.val}</h2>
              </div>
              <div className={`p-3 rounded-xl ${item.glow} ${item.color}`}>
                {item.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== MIDDLE: INTELLIGENCE & ANALYTICS ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* CAMERA CARD WITH SCANNING */}
        <Card className="relative overflow-hidden border-none bg-white dark:bg-white/5 rounded-[2rem] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Live Sensor // <span className="text-cyan-500">{province}</span>
              </CardTitle>
            </div>
            <Maximize2 className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white transition-colors" />
          </CardHeader>

          <CardContent className="flex flex-col lg:flex-row gap-6 pb-6">
            {/* SCANNING VIDEO FEED */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group">
              
              {/* SCANNING LASER EFFECT */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="w-full h-[2px] bg-cyan-500/50 shadow-[0_0_15px_#06b6d4] absolute top-0 animate-[scan_3s_linear_infinite]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)]" />
              </div>

              {/* TARGETING OVERLAY */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-20" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-500 z-20" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-cyan-500 z-20" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-500 z-20" />

              <img
                src={`http://localhost:8000/video_feed/${province.toLowerCase()}`}
                alt="Camera"
                className="object-cover w-full h-full grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              />

              <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 flex items-center gap-2">
                <Target className="w-3 h-3 text-cyan-400" />
                <span className="text-[8px] font-mono text-cyan-400 tracking-tighter uppercase">Face_Detection_Active</span>
              </div>
            </div>

            {/* RADAR SELECTOR */}
            <div className="flex flex-row lg:flex-col justify-center gap-4 bg-slate-100 dark:bg-white/5 p-4 rounded-2xl border border-white/5">
              {Provinces.map((p) => (
                <Tooltip key={p.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setProvince(p.name)}
                      className={`relative h-6 w-6 rounded-full transition-all flex items-center justify-center border-2 ${
                        province === p.name ? 'border-cyan-500 scale-125' : 'border-transparent'
                      }`}
                    >
                      <div className={`h-3 w-3 rounded-full ${p.color}`} />
                      {province === p.name && (
                        <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-30" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-[10px] font-black uppercase">
                    {p.name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ANALYTICS CARD */}
        <Card className="border-none bg-white dark:bg-white/5 rounded-[2rem] p-4 flex items-center shadow-xl overflow-hidden">
          <ChartBarMultiple />
        </Card>
      </div>

      {/* ===== BOTTOM: LOGS & SHARE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LOGS TABLE */}
        <Card className="lg:col-span-2 border-none bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personnel_Log.exe</h3>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-white/5">
                <TableRow className="border-none">
                  <TableHead className="text-[10px] font-black uppercase py-4">Name</TableHead>
                  <TableHead className="text-[10px] font-black uppercase py-4">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase py-4">Check-In</TableHead>
                  <TableHead className="text-[10px] font-black uppercase py-4 text-right pr-6">Check-Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Employees.map((e) => (
                  <TableRow key={e.name} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="font-bold py-4 pl-6 text-sm italic tracking-tighter uppercase">{e.name}</TableCell>
                    <TableCell>
                      <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                        e.status === 'present' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {e.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-slate-400">{e.check_in}</TableCell>
                    <TableCell className="font-mono text-[11px] text-slate-400 text-right pr-6">{e.check_out}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* PIE SUMMARY */}
        <Card className="border-none bg-white dark:bg-white/5 rounded-[2rem] flex flex-col items-center justify-center p-6 shadow-xl relative overflow-hidden">
           <div className="absolute top-6 left-6 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Global Registry Sync</span>
           </div>
           <ChartPieInteractive />
        </Card>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}