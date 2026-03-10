"use client";
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
import {
  ChevronDownIcon,
  LogOutIcon,
  Monitor,
  Moon,
  SunMedium,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function DashboardUserButton() {
  const { data } = authClient.useSession();

  const theme = useTheme();

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-2">
        {data?.user.image && (
          <Avatar>
            <AvatarImage src={data.user.image} />
            <AvatarFallback>{data.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm  truncate w-full">{data?.user.name}</p>
          <p className="text-xs text-muted-foreground truncate w-full">
            {" "}
            {data?.user.email}{" "}
          </p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate font-medium"> {data?.user.name} </span>
            <span className="text-sm font-normal text-muted-foreground truncate">
              {" "}
              {data?.user.email}{" "}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between"
          onClick={() => onLogout.mutate()}
        >
          Déconnexion
          <LogOutIcon className="size-4 shrink-0" />
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => theme.setTheme("dark")}>
              <SunMedium className="size-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => theme.setTheme("light")}>
              <Moon className="size-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => theme.setTheme("system")}>
              <Monitor className="size-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
