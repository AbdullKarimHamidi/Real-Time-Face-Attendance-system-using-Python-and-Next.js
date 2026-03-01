"use client"

import { ModeToggle } from '@/components/Toggle'
import React from 'react'
import DashboardCard from './_components/DashboardCard'
import Image from 'next/image'
import { Activity, ShieldCheck, Cpu } from 'lucide-react'

function Page() {
  return (
    <div className='w-full min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500'>
      
      {/* ===== CYBER COMMAND NAVBAR ===== */}
      <nav className='sticky top-0 z-50 w-full px-6 py-4'>
        {/* The Glass Container */}
        <div className='max-w-[1600px] mx-auto h-20 px-6 flex items-center justify-between rounded-3xl border border-white/20 dark:border-white/5 bg-white/70 dark:bg-[#030712]/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] relative overflow-hidden'>
          
          {/* Subtle Inner Glow Effect */}
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
          
          {/* LEFT: Logo & Identity */}
          <div className="flex items-center gap-4 group">
            <div className="relative p-2 bg-slate-900 dark:bg-white rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform duration-300 group-hover:scale-110">
              <Image src={'/Logo.svg'} alt='Logo' width={30} height={30} className="dark:invert" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-cyan-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Secure Core</span>
              </div>
              <h2 className="text-sm font-black uppercase tracking-tighter italic dark:text-white">
                Hamidi.<span className="text-cyan-500">Systems</span>
              </h2>
            </div>
          </div>

          {/* MIDDLE: System Status (Static Center) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 bg-slate-100/50 dark:bg-white/5 px-6 py-2 rounded-full border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">Biometric Sync</span>
            </div>
            <div className="h-3 w-px bg-slate-300 dark:bg-white/10" />
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-cyan-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">Real-Time</span>
            </div>
          </div>

          {/* RIGHT: System Controls */}
          <div className="flex items-center gap-3">
             <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Terminal Access</span>
                <span className="text-[9px] font-bold text-cyan-500 uppercase">Level 04</span>
             </div>
             <div className="p-1 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
               <ModeToggle />
             </div>
          </div>

          {/* Bottom "Glow Line" */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </div>
      </nav>

      {/* ===== CONTENT AREA ===== */}
      <main className="max-w-[1600px] mx-auto p-6">
        <div className="carts">
          <DashboardCard />
        </div>
      </main>
      
    </div>
  )
}

export default Page