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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import SidebarUserButton from "@/features/sidebar/sidebar-user-button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { CalendarIcon, HomeIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const firstSection = [
  {
    icon: HomeIcon,
    label: "Accueil",
    href: "/app",
  },
  {
    icon: CalendarIcon,
    label: "Reservations",
    href: "/app/bookings",
  },
];
export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.role === "admin";
  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
          <p className="text-2xl font-semibold">Cowork</p>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <SidebarSeparator className="opacity-10 text-[#5D6B68] h-px" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div layout>
                {firstSection.map((item) => (
                  <SidebarMenuItem key={item.href} className="relative">
                    {pathname === item.href && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="absolute inset-0 rounded-md bg-sidebar-accent -z-0"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "relative z-10 h-10 border-none",
                        pathname !== item.href &&
                          "hover:bg-linear-to-r/oklch ...",
                      )}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-5" />
                        <span className="text-sm font-medium tracking-tight">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
