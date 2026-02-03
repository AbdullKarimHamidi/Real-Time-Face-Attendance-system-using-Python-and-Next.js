"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  UserCheck,
  Users,
  Book,
  Settings,
  AlertCircleIcon,
  Camera,
} from "lucide-react"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const dashboarddata = [
  { name: "Dashboard", icon: LayoutDashboard, link: "/dashboard" },
  { name: "Live Attendance", icon: UserCheck, link: "/live" },
  { name: "Engineers", icon: Users, link: "/eng" },
  { name: "Reports", icon: Book, link: "/reports" },
  { name: "Intrusion", icon: AlertCircleIcon, link: "/intrusion" },
  { name: "Snapshots", icon: Camera, link: "/snapshots" },
  { name: "Settings", icon: Settings, link: "/settings" },
]
export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const isCollapsed = state === "collapsed"

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center gap-3 py-10 px-4">
          <Image src="/Logo.svg" alt="Logo" width={40} height={40} />
          {!isCollapsed && (
            <h1 className="text-xl font-bold whitespace-nowrap">
              FarsRoute ISP
            </h1>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel>
                Hamidi Realtime Attendance System
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {dashboarddata.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    pathname === item.link ||
                    pathname.startsWith(item.link + "/")
                  return (
                    <SidebarMenuItem key={item.name}>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                            >
                              <Link href={item.link}>
                                <Icon />
                              </Link>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {item.name}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                        >
                          <Link
                            href={item.link}
                            className="flex items-center gap-3">
                            <Icon />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-4 py-3 text-sm text-muted-foreground">
          {!isCollapsed && "Hamidi"}
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
