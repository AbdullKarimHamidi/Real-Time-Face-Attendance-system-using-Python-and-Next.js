import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import All_users_report from "./_components/AllEngineersReport";

import MonthReport from "./_components/monthreports";
import Image from "next/image";
import { ModeToggle } from "@/components/Toggle";
import { 
  FileText, 
  Users, 
  UserCheck, 
  CalendarDays, 
  ShieldQuestion, 
  Activity,
  ArrowRight
} from "lucide-react";
import OnePersonReport from "./_components/OnePersonReport";

function Page() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 pb-10">
      
      {/* ===== COMMAND HEADER ===== */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#030712]/80 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-2 bg-slate-900 dark:bg-white rounded-xl shadow-lg">
            <Image src={'/Logo.svg'} width={32} height={32} alt="Sight.AI Logo" className="dark:invert" />
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Security Intelligence</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Analytical.<span className="text-cyan-500">Reports</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Archive Status</span>
             <span className="text-[10px] font-black text-emerald-500 uppercase italic">All Nodes Synced</span>
          </div>
          <ModeToggle />
        </div>
      </nav>

      {/* ===== REPORT INTERFACE ===== */}
      <main className="max-w-[1600px] mx-auto p-6 ">
        <Tabs defaultValue="all" className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: COMMAND SELECTOR */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-32 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-4">Select Protocol</p>
              
              <TabsList className="flex flex-col h-auto bg-transparent border-none gap-2 p-0 w-full">
                <TabsTrigger 
                  value="all" 
                  className="w-full justify-start gap-4 px-6 py-5 rounded-2xl border border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-white/10 data-[state=active]:bg-white dark:data-[state=active]:bg-white/5 data-[state=active]:shadow-xl transition-all group"
                >
                  <Users className="w-5 h-5 text-slate-400 group-data-[state=active]:text-cyan-500" />
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest">Global Audit</p>
                    <p className="text-[9px] opacity-50 font-medium">All Personnel Activity</p>
                  </div>
                </TabsTrigger>

                <TabsTrigger 
                  value="specifc" 
                  className="w-full justify-start gap-4 px-6 py-5 rounded-2xl border border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-white/10 data-[state=active]:bg-white dark:data-[state=active]:bg-white/5 data-[state=active]:shadow-xl transition-all group"
                >
                  <UserCheck className="w-5 h-5 text-slate-400 group-data-[state=active]:text-blue-500" />
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest">Subject Filter</p>
                    <p className="text-[9px] opacity-50 font-medium">Specific Entity Search</p>
                  </div>
                </TabsTrigger>

                <TabsTrigger 
                  value="onemonth" 
                  className="w-full justify-start gap-4 px-6 py-5 rounded-2xl border border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-white/10 data-[state=active]:bg-white dark:data-[state=active]:bg-white/5 data-[state=active]:shadow-xl transition-all group"
                >
                  <CalendarDays className="w-5 h-5 text-slate-400 group-data-[state=active]:text-purple-500" />
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest">Temporal Log</p>
                    <p className="text-[9px] opacity-50 font-medium">Monthly Range Archive</p>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* HELPER CARD */}
              <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
                 <ShieldQuestion className="w-8 h-8 mb-4 opacity-50" />
                 <h4 className="font-black italic uppercase tracking-tighter text-lg mb-2">Need Export?</h4>
                 <p className="text-[10px] leading-relaxed opacity-90 font-bold tracking-wide uppercase">Reports are auto-generated in encrypted PDF and CSV formats for external audit.</p>
                 <button className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-black/20 px-3 py-2 rounded-lg hover:bg-black/30 transition">
                    Protocol Guide <ArrowRight className="w-3 h-3" />
                 </button>
              </div>
            </div>
          </div>

          {/* RIGHT: DATA CONTENT */}
          <div className="flex-1 min-h-[70vh] relative">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-[3rem] border border-slate-200 dark:border-white/10 -z-10 shadow-inner" />
            
            <div className="p-2 md:p-8 overflow-hidden">
              <TabsContent value="all" className="m-0 focus-visible:ring-0">
                <div className="mb-8 flex items-center justify-between">
                   <h2 className="text-2xl font-black uppercase italic tracking-tighter">Global Audit Stream</h2>
                   <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-bold text-cyan-500 tracking-widest">LIVE DATA</div>
                </div>
                <All_users_report />
              </TabsContent>

              <TabsContent value="specifc" className="m-0 focus-visible:ring-0">
                <div className="mb-8 flex items-center justify-between">
                   <h2 className="text-2xl font-black uppercase italic tracking-tighter">Subject Identification</h2>
                   <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-500 tracking-widest">QUERY MODE</div>
                </div>
                <OnePersonReport/>
              </TabsContent>

              <TabsContent value="onemonth" className="m-0 focus-visible:ring-0">
                <div className="mb-8 flex items-center justify-between">
                   <h2 className="text-2xl font-black uppercase italic tracking-tighter">Temporal Archive Log</h2>
                   <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-500 tracking-widest">HISTORY SYNC</div>
                </div>
                <MonthReport/>
              </TabsContent>
            </div>
          </div>

        </Tabs>
      </main>

      {/* FOOTER BREADCRUMB */}
      <footer className="max-w-[1600px] mx-auto px-10 mt-10 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
         <p>Reporting Module v4.2 // Terminal Access Restricted</p>
         <div className="flex gap-8">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> DB Sync: 100%</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" /> API: Stable</span>
         </div>
      </footer>
    </div>
  );
}

export default Page;