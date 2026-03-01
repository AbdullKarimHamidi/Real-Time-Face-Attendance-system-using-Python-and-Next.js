"use client";

import { ModeToggle } from "@/components/Toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserCircle2, Phone, MapPin, Mail, ChevronRight, Fingerprint } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Engineer {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  image: string;
}

function Page() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState("Kabul");

  const fetchEngineers = async () => {
    try {
      const res = await fetch("http://localhost:8000/all_engineers");
      const data = await res.json();
      setEngineers(data);
    } catch (err) {
      console.error("Database connection failed", err);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  const cities = ["Kabul", "Kandahar", "Badghis", "Herat"];

  const filteredEngineers = engineers
    .filter((eng) => eng.city === activeCity)
    .filter(
      (eng) =>
        eng.name.toLowerCase().includes(search.toLowerCase()) ||
        eng.lastName.toLowerCase().includes(search.toLowerCase()) ||
        eng.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 pb-20">
      
      {/* Header Area */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 dark:bg-[#020617]/70 border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Fingerprint className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic hidden md:block">
              Personnel.<span className="text-cyan-500">DB</span>
            </h1>
          </div>

          <div className="relative flex-1 max-w-xl group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
            </div>
            <Input
              placeholder="Query Subject Name or Email..."
              className="w-full pl-12 bg-slate-100 dark:bg-white/5 border-none rounded-2xl h-12 text-sm focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ModeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        {/* City Filter / Tabs */}
        <div className="flex flex-col items-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Select Deployment Zone</p>
          <Tabs value={activeCity} onValueChange={setActiveCity} className="w-full max-w-2xl">
            <TabsList className="grid grid-cols-4 h-14 p-1 bg-slate-200/50 dark:bg-white/5 rounded-2xl backdrop-blur-md">
              {cities.map((city) => (
                <TabsTrigger
                  key={city}
                  value={city}
                  className="rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-cyan-500 dark:data-[state=active]:text-black shadow-sm transition-all"
                >
                  {city}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Engineers Grid */}
        <div className="relative">
          {filteredEngineers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
              <UserCircle2 className="w-16 h-16 text-slate-300 mb-4 opacity-20" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Zero Subjects Found in {activeCity} Sector
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {filteredEngineers.map((eng, idx) => (
                <Link key={eng._id} href={`editeng?id=${eng._id}`}>
                  <Card className="group relative overflow-hidden bg-white dark:bg-white/5 border-none rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none hover:scale-[1.02] transition-all duration-500">
                    
                    {/* Visual Decor */}
                    <div className="absolute top-0 right-0 p-6 text-[10px] font-mono text-slate-300 dark:text-white/10">
                      ID: 00{idx + 1}
                    </div>

                    <CardContent className="p-8">
                      <div className="flex flex-col items-center text-center space-y-6">
                        
                        {/* Profile Image with Neural Glow */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full scale-0 group-hover:scale-125 transition-transform duration-700" />
                          <div className="relative p-1 rounded-full border-2 border-slate-100 dark:border-white/10 group-hover:border-cyan-500 transition-colors">
                            <img
                              src={eng.image || "/default-avatar.png"}
                              alt={eng.name}
                              className="w-32 h-32 object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full shadow-sm">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          </div>
                        </div>

                        {/* Text Data */}
                        <div className="space-y-2">
                          <h3 className="font-black text-2xl tracking-tighter uppercase italic group-hover:text-cyan-500 transition-colors">
                            {eng.name} {eng.lastName}
                          </h3>
                          <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                            <Mail className="w-3 h-3" />
                            <p className="text-xs font-medium">{eng.email}</p>
                          </div>
                        </div>

                        {/* Footer Stats Row */}
                        <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                          <div className="text-left">
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 flex items-center gap-1">
                              <MapPin className="w-2 h-2" /> Sector
                            </p>
                            <p className="text-xs font-bold">{eng.city}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 flex items-center gap-1 justify-end">
                              <Phone className="w-2 h-2" /> Link
                            </p>
                            <p className="text-xs font-bold">{eng.phone}</p>
                          </div>
                        </div>

                        {/* Hover Action */}
                        <div className="w-full pt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em]">
                              Edit Subject Data <ChevronRight className="w-3 h-3" />
                           </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Decorative Network Overlay */}
      <div className="fixed bottom-10 right-10 pointer-events-none opacity-20">
         <div className="w-32 h-32 border border-slate-400 dark:border-white/20 rounded-full animate-spin-slow flex items-center justify-center">
            <div className="w-20 h-20 border border-slate-400 dark:border-white/20 rounded-full animate-reverse-spin" />
         </div>
      </div>
    </div>
  );
}

export default Page;