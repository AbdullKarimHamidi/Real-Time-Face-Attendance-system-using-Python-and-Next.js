"use client"

import { ModeToggle } from "@/components/Toggle";
import { 
  Cpu, Bot, Activity, Fingerprint, Zap, ArrowRight, 
  ShieldAlert, Dna, Globe, Terminal, MessageSquare, 
  Github, Twitter, Mail, Command
} from "lucide-react";
import Image from "next/image";
import React from "react";

function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 transition-colors duration-700 font-sans">
    
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-400/10 dark:bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      {/* ===== Glass Navigation ===== */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-[#030712]/70">
        <div className="flex justify-between items-center px-10 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="p-2 bg-slate-900 dark:bg-white rounded-xl transition-transform group-hover:rotate-12">
              <Dna className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Hamidi<span className="text-cyan-500">Face</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <a href="#system" className="hover:text-cyan-500 transition">Infrastructure</a>
              <a href="#bot" className="hover:text-cyan-500 transition">Telegram Uplink</a>
              <a href="#logs" className="hover:text-cyan-500 transition">Real-time Logs</a>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block" />
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* ===== Hero Section (Neural Scan) ===== */}
      <section className="relative z-10 pt-24 pb-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-widest">v4.0 Protocol Active</span>
          </div>
          <h2 className="text-7xl lg:text-[100px] font-black leading-[0.8] tracking-tighter uppercase">
            Presence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              Validated.
            </span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-snug italic">
            Zero-latency biometric synchronization. Integrated with your Telegram workflow for instant employee check-in verification.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-10 py-6 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-tighter rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-xl shadow-cyan-500/10">
              Access Dashboard
            </button>
            <button className="px-10 py-6 border-2 border-slate-200 dark:border-white/10 font-black uppercase tracking-tighter rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              View API
            </button>
          </div>
        </div>

        {/* The Animated Scanner Component */}
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400/30 blur-[100px] rounded-full opacity-20 scale-75 animate-pulse" />
          <div className="relative rounded-[3rem] border-4 border-white dark:border-white/10 overflow-hidden shadow-2xl bg-white dark:bg-black/40 p-2">
             <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_15px_cyan] animate-scan z-20" />
             <Image 
              src={'/face2.jpg'}
              width={200}
              height={200}
               className="w-full aspect-square object-cover rounded-[2.5rem] opacity-80 dark:opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
               alt="AI Recognition Target"
             />
           
             <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                      <span className="font-mono text-[10px] text-white">SCANNING:FarsRout ISP</span>
                   </div>
                </div>
                <div className="bg-cyan-500 p-4 rounded-2xl shadow-lg">
                   <Fingerprint className="text-white w-6 h-6" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ===== The "Handshake" Bridge (Bot Logs) ===== */}
      <section id="logs" className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">Bot Synchronicity</h3>
            <p className="text-slate-500 dark:text-slate-400">Your Telegram bot doesn't just notify; it acts as a secure ledger. Every entrance and exit event triggers a database write and a push notification simultaneously.</p>
            <div className="flex gap-4">
               <div className="p-4 bg-white dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/10 flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Registration Flow</p>
                  <p className="text-xs font-bold uppercase tracking-widest">Active via /start</p>
               </div>
               <div className="p-4 bg-white dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/10 flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Webhook Latency</p>
                  <p className="text-xs font-bold uppercase tracking-widest">~84ms</p>
               </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-6 font-mono text-[11px] text-cyan-400 shadow-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
               <Terminal className="w-3 h-3" />
               <span className="uppercase tracking-widest opacity-50">Telegram_Handshake_Service</span>
            </div>
            <p className="mb-1 opacity-60 font-bold">[14:02:44] RECV: FACE_ID_091</p>
            <p className="mb-1 font-bold text-white tracking-widest animate-pulse">&gt; QUERYING_EMPLOYEE_DB...</p>
            <p className="mb-1 text-green-400">[14:02:45] MATCH: Alexander_Pierce</p>
            <p className="mb-1 text-yellow-400">[14:02:45] TRIGGER: Bot_Push_Notification</p>
            <p className="text-white">&gt; Done. Waiting for next vector...</p>
          </div>
        </div>
      </section>

      {/* ===== Industrial Bento Footer ===== */}
      <footer className="bg-slate-50 dark:bg-[#060a16] border-t border-slate-200 dark:border-white/5 pt-24 pb-12 px-10 relative z-10 overflow-hidden">
        {/* Abstract Mesh Background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
           <Globe className="w-[800px] h-[800px] absolute -right-40 -top-40" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            
          
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Command className="w-6 h-6 text-cyan-500" />
                 <span className="text-xl font-black tracking-tighter uppercase italic">Sight.AI</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                The next generation of workplace surveillance and automated management. Neural-linked attendance for the modern enterprise.
              </p>
              <div className="flex gap-4">
                <Github className="w-5 h-5 cursor-pointer hover:text-cyan-500 transition" />
                <Twitter className="w-5 h-5 cursor-pointer hover:text-cyan-500 transition" />
                <Mail className="w-5 h-5 cursor-pointer hover:text-cyan-500 transition" />
              </div>
            </div>

            {/* Column 2: System Links */}
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 underline decoration-cyan-500 decoration-4 underline-offset-8">Infrastructure</h4>
               <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-cyan-500 transition">Neural Core</a></li>
                  <li><a href="#" className="hover:text-cyan-500 transition">Face-DB Sync</a></li>
                  <li><a href="#" className="hover:text-cyan-500 transition">Telegram API</a></li>
                  <li><a href="#" className="hover:text-cyan-500 transition">Security Audit</a></li>
               </ul>
            </div>

            {/* Column 3: Live Stats */}
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 underline decoration-cyan-500 decoration-4 underline-offset-8">Network Status</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                     <span className="text-xs text-slate-500">Uptime</span>
                     <span className="text-xs font-mono text-green-500">99.98%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-2">
                     <span className="text-xs text-slate-500">API Health</span>
                     <span className="text-xs font-mono text-cyan-500">OPTIMAL</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs text-slate-500">Bot Instances</span>
                     <span className="text-xs font-mono">14 ACTIVE</span>
                  </div>
               </div>
            </div>

            {/* Column 4: Newsletter/CTA */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10">
               <h4 className="text-sm font-black uppercase mb-4">Stay Connected</h4>
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="E-MAIL PROTOCOL" 
                    className="w-full bg-slate-100 dark:bg-black/40 border-none rounded-xl py-4 px-4 text-[10px] focus:ring-2 focus:ring-cyan-500" 
                  />
                  <button className="absolute right-2 top-2 p-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg">
                    <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-200 dark:border-white/10 pt-10 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
             <p>© 2026 SIGHT.AI BIOMETRICS. ALL RIGHTS SECURED.</p>
             <div className="flex gap-12 mt-6 md:mt-0">
                <a href="#" className="hover:text-cyan-500 transition">Privacy</a>
                <a href="#" className="hover:text-cyan-500 transition">Terms</a>
                <a href="#" className="hover:text-cyan-500 transition">Enc_Keys</a>
             </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0% }
          50% { top: 100% }
          100% { top: 0% }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Page;