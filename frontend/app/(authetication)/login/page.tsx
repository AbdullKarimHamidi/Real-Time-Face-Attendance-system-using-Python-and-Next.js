"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { 
  Sun, Moon, Scan, Mail, Lock, ArrowRight, 
  ShieldCheck, Aperture, Activity, Cpu, CheckCircle2 
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdvancedLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => (prev >= 100 ? 100 : prev + 2));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [isScanning]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-[#020617] transition-colors duration-500 font-sans">
      
      {/* Left Side: The "Neural" Monitoring Station */}
      <div className="hidden md:flex md:w-3/5 relative overflow-hidden bg-black">
        {/* Background Image with Lower Opacity for HUD visibility */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 grayscale-[0.5]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')` }}
        />
        
        {/* Animated Scanning Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        
        {/* Real-time HUD Elements */}
        <div className="relative z-20 w-full p-12 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                <Scan className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter text-white uppercase block">VisionAuth <span className="text-blue-500">v2.0</span></span>
                <span className="text-xs font-mono text-blue-400/80">CORE_ENGINE_ACTIVE // PORT: 8080</span>
              </div>
            </div>

            <div className="flex gap-6 font-mono text-[10px] text-blue-400">
              <div className="flex flex-col items-end">
                <span>LATENCY</span>
                <span className="text-white text-sm">14ms</span>
              </div>
              <div className="flex flex-col items-end">
                <span>ACCURACY</span>
                <span className="text-white text-sm">99.8%</span>
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-6">
              <Activity size={14} className="animate-spin-slow" />
              NEURAL NETWORK READY
            </div>
            <h1 className="text-6xl font-bold text-white leading-tight mb-4">
              Biometric <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Gatekeeper.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Deploying real-time facial recognition and liveness detection 
              to secure your perimeter. 
            </p>
          </div>

          {/* System Logs Visualizer */}
          <div className="grid grid-cols-3 gap-4">
             <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <Cpu size={20} className="text-blue-500 mb-2" />
                <div className="text-[10px] text-slate-500 uppercase">Processing</div>
                <div className="text-white font-mono text-sm uppercase">Nvidia Tensor</div>
             </div>
             <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <ShieldCheck size={20} className="text-emerald-500 mb-2" />
                <div className="text-[10px] text-slate-500 uppercase">Encryption</div>
                <div className="text-white font-mono text-sm uppercase">AES-256 GCM</div>
             </div>
             <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <CheckCircle2 size={20} className="text-blue-400 mb-2" />
                <div className="text-[10px] text-slate-500 uppercase">Method</div>
                <div className="text-white font-mono text-sm uppercase">One-Shot Bio</div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="absolute top-8 right-8 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-all"
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-700" />}
        </button>

        <div className="w-full max-w-[400px] space-y-10">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Access Terminal</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Please verify your identity to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
                  type="email" 
                  placeholder="Employee Email"
                  className="h-14 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl pl-12 focus:ring-blue-500/20"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input 
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  type="password" 
                  placeholder="Security Code"
                  className="h-14 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-2xl pl-12 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all active:scale-[0.98]">
              Authorized Entry
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative flex items-center gap-4">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">OR BIOMETRIC</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* AI Face Recognition Section */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsScanning(!isScanning)}
                className={`w-full group relative overflow-hidden h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                  isScanning 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/50 bg-white dark:bg-slate-950'
                }`}
              >
                {/* Scanning Bar Animation */}
                {isScanning && (
                  <div className="absolute inset-0 z-0">
                    <div 
                      className="w-full h-[2px] bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] absolute animate-scan"
                      style={{ top: `${scanProgress}%` }}
                    />
                  </div>
                )}
                
                <Aperture className={`w-8 h-8 transition-all ${isScanning ? 'text-blue-500 animate-spin-slow' : 'text-slate-400 group-hover:text-blue-500'}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${isScanning ? 'text-blue-500' : 'text-slate-500'}`}>
                  {isScanning ? `Analyzing Face... ${scanProgress}%` : 'Initialize Face Attendance'}
                </span>
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-500">
            System monitored by <span className="text-blue-500 font-bold italic">CyberWatch AI</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdvancedLogin;