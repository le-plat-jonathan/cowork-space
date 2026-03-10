"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { UserPlusIcon } from "lucide-react";
import { getRecentAccounts } from "../admin.action";

export function NewAccountsCard() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "recent-accounts"],
    queryFn: () => getRecentAccounts(),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Nouveaux comptes</CardTitle>
        <UserPlusIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{users?.length ?? 0}</span>
              <Badge variant="secondary">7 derniers jours</Badge>
            </div>
            {users && users.length > 0 && (
              <ul className="space-y-1.5">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground truncate">
                      {user.email}
                    </span>
                    <span className="text-xs text-muted-foreground/60 shrink-0 ml-2">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
