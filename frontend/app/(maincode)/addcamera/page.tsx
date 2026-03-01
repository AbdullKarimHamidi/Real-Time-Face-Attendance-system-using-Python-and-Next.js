"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Video, 
  ShieldCheck, 
  Network, 
  KeyRound, 
  User, 
  Loader2, 
  Plus, 
  Activity,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface CameraFormData {
  name: string;
  username: string;
  password: string;
  ip: string;
}

interface CameraErrors {
  name?: string;
  username?: string;
  password?: string;
  ip?: string;
}

export default function Page() {
  const [formData, setFormData] = useState<CameraFormData>({
    name: "",
    username: "",
    password: "",
    ip: "",
  });

  const [errors, setErrors] = useState<CameraErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validate = (): boolean => {
    const e: CameraErrors = {};
    if (!formData.name.trim()) e.name = "Identification required";
    if (!formData.username.trim()) e.username = "Credential required";
    if (!formData.password.trim()) e.password = "Encryption key required";

    const ipPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    if (!formData.ip.trim()) {
      e.ip = "Network address required";
    } else if (!ipPattern.test(formData.ip)) {
      e.ip = "Protocol mismatch (Invalid IP)";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name as keyof CameraErrors]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Validation Error", { description: "Please check terminal parameters." });
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("camname", formData.name);
    form.append("username", formData.username);
    form.append("password", formData.password);
    form.append("ipaddress", formData.ip);

    try {
      const res = await fetch("http://localhost:8000/addCamera", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        toast.success("Stream Initialized", {
          description: `Camera ${formData.name} linked to ${formData.ip}`,
        });
        setFormData({ name: "", username: "", password: "", ip: "" });
        return;
      }
      
      const errorText = await res.text();
      toast.error("Handshake Failed", { description: errorText });
    } catch (error) {
      toast.error("Network Error", { description: "Cannot establish connection to core server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#09090b] p-4 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full" />
      
      {/* HEADER SECTION */}
      <header className="max-w-4xl mx-auto w-full h-20 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl border border-white dark:border-white/10 rounded-[2rem] shadow-xl flex justify-between items-center px-8 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/10">
            <Image src="/Logo.svg" alt="logo" width={24} height={24} className="brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.2em] italic">Node <span className="text-indigo-600">Provisioning</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Surveillance Network Expansion</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Link Ready</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: STATUS CARD */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white shadow-2xl relative overflow-hidden">
            <Activity className="absolute bottom-[-10px] right-[-10px] w-32 h-32 text-indigo-500/10" />
            <h2 className="text-xl font-black italic uppercase mb-4 tracking-tighter">New Hardware <br/><span className="text-indigo-500">Integration</span></h2>
            <div className="space-y-4 relative z-10">
              <div className="flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-indigo-500 mt-1" />
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">Ensure the IP address is static to prevent protocol disconnects.</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Encryption Level</h3>
            <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full">
              <div className="h-full w-2/3 bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
        </div>

        {/* RIGHT: REGISTRATION FORM */}
        <Card className="lg:col-span-7 border-none bg-white/80 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardHeader className="pt-10 px-10">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Terminal <span className="text-indigo-600">Auth</span></CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em]">Input hardware authentication keys</CardDescription>
          </CardHeader>

          <CardContent className="p-10 pt-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Camera Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                  <Video className="w-3 h-3 text-slate-400" />
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hardware ID</label>
                </div>
                <Input
                  name="name"
                  placeholder="Front Entrance 01"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                />
                {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.name}</p>}
              </div>

              {/* IP Address */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                  <Network className="w-3 h-3 text-slate-400" />
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">IP Protocol</label>
                </div>
                <Input
                  name="ip"
                  placeholder="192.168.1.50"
                  value={formData.ip}
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                />
                {errors.ip && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.ip}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Root User</label>
                </div>
                <Input
                  name="username"
                  placeholder="admin"
                  value={formData.username}
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                />
                {errors.username && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.username}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                  <KeyRound className="w-3 h-3 text-slate-400" />
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access Token</label>
                </div>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                />
                {errors.password && <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">{errors.password}</p>}
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="mt-4 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/30 group"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <div className="flex items-center gap-2 italic">
                  Initialize Node <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}