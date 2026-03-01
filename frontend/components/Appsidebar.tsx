"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Users,
  Book,
  Settings,
  AlertCircleIcon,
  Camera,
  PlusCircle,
  Video,
  MonitorDot,
  Cpu,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const dashboarddata = [
  { name: "Analytics", icon: LayoutDashboard, link: "/dashboard" },
  { name: "Live View", icon: MonitorDot, link: "/Live_attendance" },
  { name: "Personnel", icon: Users, link: "/eng" },
  { name: "Reports", icon: Book, link: "/reports" },
  { name: "Intrusion", icon: AlertCircleIcon, link: "/intrusion" },
  { name: "Snapshots", icon: Camera, link: "/snapshots" },
  { name: "Add Employee", icon: PlusCircle, link: "/addENG" },
  { name: "Camera Config", icon: Video, link: "/addcamera" },
  { name: "Settings", icon: Settings, link: "/settings" },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";

  return (
    <TooltipProvider delayDuration={0}>
      <div className={`h-screen flex flex-col transition-all duration-500 ${isCollapsed ? "p-3 w-[84px]" : "p-0 w-[280px]"}`}>
        <Sidebar 
          collapsible="icon" 
          className={`
            border-none shadow-2xl transition-all duration-500 ease-in-out overflow-hidden
            ${isCollapsed 
              ? "bg-white/80 dark:bg-slate-950/40 backdrop-blur-2xl border border-white/20 shadow-cyan-500/5" 
              : "bg-white dark:bg-[#020617] border-r border-slate-200 dark:border-white/5"}
          `}
        >
       
          <SidebarHeader className={`flex items-center transition-all duration-500 ${isCollapsed ? "py-6 justify-center" : "gap-3 py-8 px-6"}`}>
            <div className="relative cursor-pointer shrink-0" onClick={toggleSidebar}>
                <div className={`absolute inset-0 bg-cyan-500/20 blur-xl rounded-full transition-opacity ${isCollapsed ? "opacity-100" : "opacity-0"}`} />
                <Image 
                    src="/Logo.svg" 
                    alt="Logo" 
                    width={28} 
                    height={28} 
                    className={`relative z-10 transition-all duration-500 dark:invert ${isCollapsed ? "scale-110 rotate-12" : "scale-100"}`}
                />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
                <h1 className="text-xs font-black tracking-widest uppercase italic text-slate-900 dark:text-white truncate">
                  FarsRoute
                </h1>
                <div className="flex items-center gap-1">
                    <Cpu className="w-2 h-2 text-cyan-500" />
                    <span className="text-[8px] font-bold text-cyan-500 uppercase tracking-[0.2em]">Security Core</span>
                </div>
              </div>
            )}
          </SidebarHeader>

          {/* CONTENT */}
          <SidebarContent className="px-2 overflow-hidden select-none">
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {dashboarddata.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.link || pathname.startsWith(item.link + "/");

                    return (
                      <SidebarMenuItem key={item.name} className="px-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              className={`
                                  h-11 w-full transition-all duration-300 rounded-xl relative group
                                  ${isActive 
                                      ? "bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]" 
                                      : "text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-500"
                                  }
                              `}
                            >
                              <Link href={item.link} className={`flex items-center ${isCollapsed ? "justify-center" : "px-3 gap-3"}`}>
                                <Icon className={`w-[1.1rem] h-[1.1rem] shrink-0 transition-all group-hover:scale-110 ${isActive ? "scale-110 rotate-3" : ""}`} />
                                {!isCollapsed && (
                                  <span className="text-[11px] font-black tracking-tight truncate uppercase">
                                    {item.name}
                                  </span>
                                )}
                                {isActive && !isCollapsed && (
                                    <div className="absolute right-2 w-1 h-4 bg-white/40 rounded-full animate-pulse" />
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent 
                              side="right" 
                              className="font-black text-[9px] uppercase tracking-widest border-none bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                            >
                              {item.name}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className={`transition-all duration-500 ${isCollapsed ? "py-6 justify-center" : "p-5"}`}>
             <div className={`transition-all duration-500 ${isCollapsed ? "w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" : "p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"}`}>
                {!isCollapsed && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational</span>
                    </div>
                    <span className="text-[8px] font-mono text-cyan-500/50 uppercase">v4.0.2</span>
                  </div>
                )}
             </div>
          </SidebarFooter>
        </Sidebar>
      </div>
    </TooltipProvider>
  );
}