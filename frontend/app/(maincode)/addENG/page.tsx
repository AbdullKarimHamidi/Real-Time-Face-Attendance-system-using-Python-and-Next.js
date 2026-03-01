"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { 
  ImagePlus, 
  Loader, 
  UserPlus, 
  MapPin, 
  Phone, 
  Mail, 
  SendHorizontal, 
  Fingerprint,
  Send
} from "lucide-react";
import { toast } from "sonner";
import { EngeneerSchema, cityies } from "@/lib/ZoneSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function Page() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof EngeneerSchema>>({
    resolver: zodResolver(EngeneerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      address: "",
      city: "",
      email: "",
      phone: "",
      tid: "",
      Images: [],
    },
  });

  async function onSubmit(data: z.infer<typeof EngeneerSchema>) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("phone", data.phone);
      formData.append("tid", data.tid);
      data.Images.forEach((file) => formData.append("images", file));

      const res = await fetch("http://localhost:8000/add-engineer", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      
      toast.success("Employee Profile Synchronized");
      form.reset();
      setPreviews([]);
    } catch (error) {
      toast.error("Database Connection Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4 md:p-10 bg-[#f8fafc] dark:bg-[#09090b] relative overflow-hidden">
      {/* Visual Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full" />

      <div className="w-full max-w-6xl bg-white/80 dark:bg-zinc-900/50 backdrop-blur-2xl border border-white dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
          
          {/* LEFT PANEL: Identity Preview */}
          <div className="lg:col-span-4 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between border-r border-white/5">
            <div>
              <div className="inline-flex p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-6">
                <Fingerprint className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">Personnel<br/><span className="text-indigo-400 text-4xl">Onboarding</span></h1>
              <p className="text-slate-400 text-sm mt-4 font-medium leading-relaxed">
                Registering a new engineer into the secure directory. All fields are mandatory for clearance.
              </p>
            </div>

            <div className="mt-12">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Biometric Previews</p>
              <div className="grid grid-cols-3 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                  </div>
                ))}
                {previews.length === 0 && (
                  <div className="col-span-3 py-10 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center">
                    <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest italic">Awaiting Images...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: The Complete Form */}
          <div className="lg:col-span-8 p-8 md:p-14 overflow-y-auto max-h-[90vh]">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              
              {/* BLOCK 1: PRIMARY IDENTITY */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Core Identity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldGroup className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">First Name</label>
                    <Controller name="name" control={form.control} render={({ field }) => (
                      <Input {...field} placeholder="Ahmad" className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/20" />
                    )} />
                  </FieldGroup>
                  <FieldGroup className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Last Name</label>
                    <Controller name="lastName" control={form.control} render={({ field }) => (
                      <Input {...field} placeholder="hamidi" className="h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/20" />
                    )} />
                  </FieldGroup>
                </div>
              </section>

              {/* BLOCK 2: CONNECTIVITY (Email, Phone, Telegram) */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Communication Channels</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Controller name="email" control={form.control} render={({ field }) => (
                        <Input {...field} type="email" placeholder="example@gmail.com" className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10" />
                      )} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Controller name="phone" control={form.control} render={({ field }) => (
                        <Input {...field} placeholder="+93..." className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10" />
                      )} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Telegram ID</label>
                    <div className="relative">
                      <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Controller name="tid" control={form.control} render={({ field }) => (
                        <Input {...field} placeholder="Bot send ID" className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10" />
                      )} />
                    </div>
                  </div>
                </div>
              </section>

              {/* BLOCK 3: GEOGRAPHY (Address, City) */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Controller name="address" control={form.control} render={({ field }) => (
                        <Input {...field} placeholder="Street, Area, Building" className="pl-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10" />
                      )} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">City Hub</label>
                    <Controller name="city" control={form.control} render={({ field }) => (
                      <select {...field} className="w-full h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="">Select City</option>
                        {cityies.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )} />
                  </div>
                </div>
              </section>

              {/* BLOCK 4: IMAGE SYSTEM */}
              <div className="pt-4">
                <label className="group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5 hover:border-indigo-400 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center py-5">
                    <ImagePlus className="w-8 h-8 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Capture Bio-Images</p>
                  </div>
                  <input type="file" multiple accept="image/*" hidden onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    form.setValue("Images", files, { shouldValidate: true });
                    setPreviews(files.map(f => URL.createObjectURL(f)));
                  }} />
                </label>
                {form.formState.errors.Images && (
                  <p className="text-[10px] text-red-500 font-bold uppercase mt-2 text-center tracking-widest">{form.formState.errors.Images.message}</p>
                )}
              </div>

              {/* SUBMIT */}
              <Button disabled={loading} className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 transition-all active:scale-95 font-black uppercase tracking-[0.2em] group">
                {loading ? <Loader className="animate-spin w-5 h-5" /> : (
                  <span className="flex items-center gap-3">
                    Commit to Directory <SendHorizontal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}