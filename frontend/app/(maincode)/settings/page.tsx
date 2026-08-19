
"use client";

import { ModeToggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CalendarDays, Save, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

function Page() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // New states for Holiday Management
  const [holidayName, setHolidayName] = useState("");
  const [holidayStart, setHolidayStart] = useState("");
  const [holidayEnd, setHolidayEnd] = useState("");
  const [isSavingHoliday, setIsSavingHoliday] = useState(false);

  const add_time = async () => {
    if (!startTime || !endTime) {
      toast.error("Configuration Incomplete", {
        description: "Please select both start and end operation hours.",
      });
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append("start", startTime);
    formData.append("end", endTime);

    try {
      const res = await fetch("http://localhost:8000/time", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Sync Failed");
        return;
      }

      toast.success("Time configuration updated", {
        description: `Operational system is set for: ${startTime}:00 to ${endTime}:00`,
      });
    } catch (error) {
      toast.error("Server Connection Error");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const add_holiday = async () => {
    if (!holidayName || !holidayStart || !holidayEnd) {
      toast.error("Missing Fields", {
        description: "Please provide a holiday name, start date, and end date.",
      });
      return;
    }

    setIsSavingHoliday(true);

    try {
      const res = await fetch("http://localhost:8000/addholiday", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: holidayName,
          start_date: holidayStart,
          end_date: holidayEnd,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to add holiday");
        return;
      }

      toast.success("Holiday Created", {
        description: `${holidayName} has been successfully added to the system.`,
      });

      // Clear form inputs
      setHolidayName("");
      setHolidayStart("");
      setHolidayEnd("");
    } catch (error) {
      toast.error("Server Connection Error");
      console.error(error);
    } finally {
      setIsSavingHoliday(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#09090b] p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* TOP NAVIGATION BAR */}
        <header className="w-full h-20 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none flex justify-between items-center px-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Image src="/Logo.svg" alt="logo" width={28} height={28} className="brightness-0 invert" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-[0.2em] italic">System <span className="text-indigo-600">Core</span></h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">FarsRoute ISP • Settings</p>
            </div>
          </div>
          <ModeToggle />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* INFO SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
              <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
              <h2 className="text-lg font-black leading-tight mb-2 italic uppercase">Operational Window</h2>
              <p className="text-xs text-indigo-100 font-medium leading-relaxed opacity-80">
                Define the active monitoring period for the attendance matrix. Outside these hours, system resources enter standby mode.
              </p>
            </div>

            <div className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Auto-Save Protocol</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
                Last Sync: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* SETTINGS CARD (SHIFT PARAMETERS) */}
          <Card className="lg:col-span-8 border-none bg-white/80 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 overflow-hidden">
            <CardHeader className="pt-10 px-10 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Scheduler Configuration</CardDescription>
              </div>
              <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">Shift <span className="text-indigo-600">Parameters</span></CardTitle>
            </CardHeader>

            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* START TIME */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Opening Hour</label>
                  </div>
                  <Select onValueChange={(value) => setStartTime(value)}>
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Entry" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectGroup>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={`${i + 1}`} className="rounded-lg font-bold">
                            {i + 1} AM
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* END TIME */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Closing Hour</label>
                  </div>
                  <Select onValueChange={(value) => setEndTime(value)}>
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Exit" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectGroup>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 13} value={`${i + 13}`} className="rounded-lg font-bold">
                            {i + 1} PM
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* DYNAMIC RANGE PREVIEW */}
              {startTime && endTime && (
                <div className="mt-10 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 animate-in fade-in zoom-in-95">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-2">
                     <span>Shift Duration</span>
                     <span>{Number(endTime) - Number(startTime)} Hours</span>
                   </div>
                   <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-1000" 
                        style={{ width: `${((Number(endTime) - Number(startTime)) / 24) * 100}%`, marginLeft: `${(Number(startTime) / 24) * 100}%` }}
                      />
                   </div>
                </div>
              )}

              <Button 
                className="mt-10 h-16 w-full rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] italic shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.01] active:scale-[0.98]"
                onClick={add_time}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Syncing System...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Commit Changes
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* NEW HOLIDAY MANAGEMENT CARD */}
          <Card className="lg:col-span-12 border-none bg-white/80 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 overflow-hidden">
            <CardHeader className="pt-10 px-10 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Calendar Exceptions</CardDescription>
              </div>
              <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">Holiday <span className="text-blue-500">Registry</span></CardTitle>
            </CardHeader>

            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* HOLIDAY NAME */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1">
                    <CalendarDays className="w-3 h-3 text-slate-400" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Holiday Name</label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., New Year's Day"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                    className="h-14 w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* START DATE */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1">
                    <CalendarDays className="w-3 h-3 text-slate-400" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Start Date</label>
                  </div>
                  <input
                    type="date"
                    value={holidayStart}
                    onChange={(e) => setHolidayStart(e.target.value)}
                    className="h-14 w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* END DATE */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1">
                    <CalendarDays className="w-3 h-3 text-slate-400" />
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">End Date</label>
                  </div>
                  <input
                    type="date"
                    value={holidayEnd}
                    onChange={(e) => setHolidayEnd(e.target.value)}
                    className="h-14 w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button 
                className="mt-10 h-16 w-full rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] italic shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.01] active:scale-[0.98] hover:cursor-pointer"
                onClick={add_holiday}
                disabled={isSavingHoliday}
              >
                {isSavingHoliday ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving Holiday...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Holiday
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

       
        </div>
      </div>
    </div>
  );
}

export default Page;