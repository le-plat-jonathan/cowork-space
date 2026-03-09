"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export default function DashboardUserButton() {
  const { data } = authClient.useSession();
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
        <DropdownMenuItem></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
