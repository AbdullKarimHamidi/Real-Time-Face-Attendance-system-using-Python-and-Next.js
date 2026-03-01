"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  UserPlus, ShieldCheck, User, Mail, Lock, 
  ChevronRight, Camera, Fingerprint, Dna, 
  Globe, Zap, ShieldAlert, Check
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdvancedSignUp = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      
      {/* Left Side: Information & Branding */}
      <div className="hidden md:flex md:w-2/5 flex-col justify-between p-12 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Dna className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">VisionAuth <span className="text-blue-600">Pro</span></span>
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Secure Your <br />
              <span className="text-blue-600">Digital Presence.</span>
            </h1>
            
            <div className="space-y-6">
              {[
                { icon: <Camera size={20}/>, title: "Neural Face Mapping", desc: "3D depth analysis for spoof prevention." },
                { icon: <ShieldCheck size={20}/>, title: "Enterprise Security", desc: "Zero-trust architecture with AES encryption." },
                { icon: <Zap size={20}/>, title: "Instant Sync", desc: "Attendance logs updated in under 200ms." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 text-blue-600">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    </div>
                ))}
            </div>
            <p className="text-xs font-medium text-slate-500">Joined by 12,000+ personnel globally</p>
        </div>
      </div>

      {/* Right Side: Step-based Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-20">
        <div className="w-full max-w-[480px]">
          
          {/* Progress Bar */}
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: step === 1 ? '0%' : '100%' }}
            />
            {[1, 2].map((i) => (
              <div key={i} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step >= i ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {step > i ? <Check size={18} /> : i}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-3xl font-bold dark:text-white">Create Account</h2>
                <p className="text-slate-500 mt-2">Start by setting up your basic credentials.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input placeholder="First Name" className="h-14 pl-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                    </div>
                    <Input placeholder="Last Name" className="h-14 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input type="email" placeholder="Work Email Address" className="h-14 pl-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input type="password" placeholder="Create Security Password" className="h-14 pl-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full h-14 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
              >
                Proceed to Biometrics
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-4">
                    <Fingerprint size={40} className="animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold dark:text-white">Face Enrollment</h2>
                <p className="text-slate-500 mt-2">We need to map your facial features for the attendance system.</p>
              </div>

              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
                 {/* Simulated Camera Feed */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Camera size={48} className="text-slate-400 group-hover:text-blue-500 transition-colors mb-4" />
                 <p className="text-sm font-mono text-slate-500 group-hover:text-white z-20">[ CLICK TO ACTIVATE CAMERA ]</p>
                 
                 {/* Visual Corner Brackets */}
                 <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
                 <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500" />
                 <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500" />
                 <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="h-14 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={() => setIsRegistering(true)}
                    className="h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    Complete Enrollment
                  </button>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                 <ShieldAlert className="text-amber-600 shrink-0" size={18} />
                 <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-tight">
                    By proceeding, you agree to store your biometric hash locally. We never store raw images on our servers.
                 </p>
              </div>
            </div>
          )}

          <p className="mt-10 text-center text-sm text-slate-500">
            Already registered? <a href="/login" className="text-blue-600 font-bold hover:underline">Log in to terminal</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSignUp;