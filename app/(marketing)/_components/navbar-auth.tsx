"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogOutIcon,
  Monitor,
  Moon,
  Settings2Icon,
  ShieldIcon,
  SunMedium,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { MyInfoDialog } from "@/features/sidebar/my-info-dialog";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";

export default function NavbarAuth() {
  const { data: session, isPending } = authClient.useSession();
  const theme = useTheme();
  const [myInfoOpen, setMyInfoOpen] = useState(false);

  const onLogout = useMutation({
    mutationFn: async () => {
      await unwrapSafePromise(authClient.signOut());
    },
    onSuccess: () => {
      window.location.href = "/login";
    },
    onError: () => {
      toast.error("Erreur lors de la déconnexion");
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-7 w-20 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" asChild>
          <Link href="/app">
            <LayoutDashboard data-icon="inline-start" />
            Mon espace
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 pl-1.5"
            >
              <Avatar className="size-6">
                {session.user.image && (
                  <AvatarImage src={session.user.image} />
                )}
                <AvatarFallback className="text-xs">
                  {session.user.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <span className="truncate text-sm font-medium">
                {session.user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setMyInfoOpen(true)}
            >
              <Settings2Icon className="size-4" />
              <span>Mes Infos</span>
            </DropdownMenuItem>
            {session.user.role?.toLowerCase() === "admin" && (
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/admin">
                  <ShieldIcon className="size-4" />
                  <span>Admin</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Thème</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => theme.setTheme("light")}>
                  <SunMedium className="size-4" />
                  <span>Clair</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => theme.setTheme("dark")}>
                  <Moon className="size-4" />
                  <span>Sombre</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => theme.setTheme("system")}>
                  <Monitor className="size-4" />
                  <span>Système</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onLogout.mutate()}
            >
              <LogOutIcon className="size-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      <MyInfoDialog open={myInfoOpen} onOpenChange={setMyInfoOpen} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Se connecter</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/register">
          Commencer
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </div>
  );
}
