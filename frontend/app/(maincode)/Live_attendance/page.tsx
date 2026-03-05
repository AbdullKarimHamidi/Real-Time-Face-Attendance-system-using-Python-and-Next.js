"use client";

import { ModeToggle } from "@/components/Toggle";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, Radio, ShieldCheck, Activity, UserCheck } from "lucide-react";

// --- Interfaces ---
interface Camera {
  name: string;
  url: string;
  region: string;
}

type RecognizedPerson = {
  name: string;
  image: string;
  lastName: string;
};

const BASE_URL = "http://localhost:8000";

export default function LiveCamerasPage() {
  // 1. ALL HOOKS MUST BE AT THE TOP
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recognized, setRecognized] = useState<Record<string, RecognizedPerson>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Effect 1: Fetch Camera Names
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cameraname`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch cameras');
        }

        const names: string[] = await response.json();
        
        const transformedData: Camera[] = names.map((name) => ({
          name: name,
          url: `${BASE_URL}/live_camera/${name}`,
          region: "Sector Alpha" // Logic can be updated here
        }));

        setCameras(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  // Effect 2: Fetch Recognized Persons (Interval)
  useEffect(() => {
    const fetchRecognized = async () => {
      try {
        const res = await fetch(`${BASE_URL}/recognized`);
        if (res.ok) {
          const data = await res.json();
          setRecognized(data);
        }
      } catch (err) {
        console.error("Recognition fetch failed", err);
      }
    };

    fetchRecognized();
    const interval = setInterval(fetchRecognized, 2000);
    return () => clearInterval(interval);
  }, []);

  // 2. HELPER LOGIC
  const filteredCameras = cameras.filter(cam => 
    cam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getImageUrl = (path: string) => {
    if (!path) return "";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  // 3. CONDITIONAL RENDERS (Wait until loading is false)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-10 h-10 text-cyan-500 animate-spin" />
          <p className="text-sm font-black uppercase tracking-widest dark:text-white">Initializing Uplink...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="text-red-500 font-bold uppercase tracking-tighter">Error: {error}</div>
      </div>
    );
  }

  // 4. MAIN JSX
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#020617] p-4 transition-colors duration-500">
      
      {/* ===== TACTICAL NAVBAR ===== */}
      <header className="h-20 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] px-8 flex justify-between items-center shadow-2xl mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-slate-900 dark:bg-white rounded-xl">
            <Image src={"/Logo.svg"} alt="Logo" width={32} height={32} className="dark:invert" />
          </div>
          <div className="hidden md:block">
            <h2 className="text-sm font-black uppercase tracking-tighter italic dark:text-white">
              Hamidi.<span className="text-cyan-500">Live</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Active</span>
            </div>
          </div>
        </div>

        <div className="relative w-1/3 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
          <Input 
            placeholder="Search camera nodes..." 
            className="pl-10 rounded-2xl border-none bg-slate-100 dark:bg-white/5 focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Monitoring Nodes</span>
            <span className="text-[10px] font-bold text-cyan-500 uppercase">{cameras.length.toString().padStart(2, '0')} Online</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* ===== MAIN MONITORING GRID ===== */}
      <main className="w-full">
        <div className="flex items-center gap-3 mb-8 px-4">
          <Activity className="w-5 h-5 text-cyan-500" />
          <h1 className="text-xl font-black uppercase tracking-widest italic dark:text-white">
            Live Intelligence Stream
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {filteredCameras.map((cam) => {
            const person = recognized[cam.name];

            return (
              <div
                key={cam.name}
                className="group relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500 hover:shadow-cyan-500/10 hover:border-cyan-500/30"
              >
                {/* Camera Info Header */}
                <div className="px-6 py-4 flex justify-between items-center bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                      {cam.name} Node
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{cam.region}</p>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 opacity-50" />
                </div>

                {/* Video Feed Wrapper */}
                <div className="relative aspect-video mx-4 mt-4 rounded-[1.8rem] overflow-hidden border-2 border-slate-200 dark:border-white/10 group-hover:border-cyan-500/50 transition-colors bg-slate-200 dark:bg-slate-800">
                  
                  {/* Scanline Effect Animation */}
                  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    <div className="w-full h-[2px] bg-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.5)] absolute top-0 animate-[scan_4s_linear_infinite]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)] opacity-50" />
                  </div>

                  <img
                    src={cam.url}
                    alt={cam.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000";
                    }}
                  />

                  {/* HUD Overlay for Recognized Person */}
                  {person && person.name !== "Unknown" ? (
                    <div className="absolute inset-x-3 bottom-3 animate-in slide-in-from-bottom-4 fade-in duration-500 z-20">
                      <div className="bg-black/60 backdrop-blur-xl border border-white/20 text-white rounded-2xl p-3 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={getImageUrl(person.image)}
                            alt={person.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${person.name}&background=06b6d4&color=fff`;
                            }}
                          />
                          <div className="absolute -top-1 -right-1 bg-cyan-500 p-0.5 rounded-full border border-black">
                            <UserCheck className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-black uppercase tracking-widest truncate">{person.name}</p>
                            <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-black tracking-tighter shrink-0">MATCHED</span>
                          </div>
                          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter mb-1 truncate">{person.lastName}</p>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 w-[98%] animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur px-2 py-1 rounded-md border border-white/10 z-20">
                       <span className="text-[8px] font-mono text-white/60 uppercase tracking-widest">Searching...</span>
                    </div>
                  )}
                </div>

                {/* Footer Data */}
                <div className="px-6 py-6 flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase">Latency</span>
                      <span className="text-[10px] font-bold dark:text-white">14ms</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase">Bitrate</span>
                      <span className="text-[10px] font-bold dark:text-white">4.2 Mbps</span>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95">
                    View Node
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

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