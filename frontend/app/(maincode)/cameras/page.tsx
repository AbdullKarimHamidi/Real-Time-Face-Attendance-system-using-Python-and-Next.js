"use client";

import React, { useState } from "react";
import {
  Camera,
  Maximize2,
  Activity,
  ShieldCheck,
  Radio,
  LayoutGrid,
} from "lucide-react";

export default function Home() {
  const [cameras, setCameras] = useState([]);
  const fetchcameranames = async () => {
    const res = await fetch("http://localhost:8000/cameraname")
      .then((res) => res.json())
      .then((data) => setCameras(data))
      .catch((err) => console.log(err));
  };
  const [activeCam, setActiveCam] = useState(null);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 p-6 md:p-12 transition-all duration-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Live Neural Uplink // 2026
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">
            Global <span className="text-cyan-500">Surveillance</span> Wall
          </h1>
        </div>

        <div className="flex gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <div className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center gap-2 border border-cyan-500/30">
            <LayoutGrid className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Multi-View
            </span>
          </div>
          <div className="px-4 py-2 text-slate-500 flex items-center gap-2 hover:text-white transition cursor-pointer">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Bandwidth: 1.2GB/s
            </span>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cameras.map((cam, idx) => (
          <div
            key={cam}
            className="group relative flex flex-col bg-white/5 border border-white/10 rounded-[2.5rem] p-3 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden"
          >
            {/* Camera Header Overlay */}
            <div className="flex justify-between items-center mb-4 px-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/10">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest italic">
                  {cam}
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter">
                  Live
                </span>
              </div>
            </div>

            {/* Viewport Area */}
            <div className="relative aspect-video rounded-[1.8rem] overflow-hidden border border-white/5 shadow-inner">
              {/* Digital HUD Lines */}
              <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/40" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/40" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/40" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/40" />
              </div>

              {/* Video Stream */}
              <img
                src={`http://localhost:8000/video/${cam}`}
                alt={cam}
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100"
              />

              {/* Overlay Action Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-20">
                <button className="p-4 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition active:scale-95">
                  <Maximize2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-5 px-4 pb-2 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-4 items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono tracking-widest uppercase">
                  Verified Uplink
                </span>
              </div>
              <p className="text-[10px] font-mono">FR: 30FPS</p>
            </div>

            {/* Glow Effect Background */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-all" />
          </div>
        ))}

        {/* Placeholder for Add Camera */}
        <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-slate-500 hover:border-cyan-500/30 hover:text-cyan-500 transition group cursor-pointer">
          <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition">
            <Camera className="w-8 h-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest italic">
            Add Node
          </span>
        </div>
      </div>

      {/* Bottom Global Status Bar */}
      <div className="max-w-7xl mx-auto mt-16 p-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-6">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              Database Sync
            </p>
            <p className="text-sm font-black italic uppercase tracking-tighter">
              Active Protocol
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
              Encryption
            </p>
            <p className="text-sm font-black italic uppercase tracking-tighter text-cyan-400">
              ECC-512 SECURE
            </p>
          </div>
        </div>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em]">
          Autonomous Security Infrastructure 02-26-26
        </p>
      </div>
    </main>
  );
}
