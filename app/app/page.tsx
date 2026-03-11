import { getDashboardData } from "@/features/dashboard/dashboard.action";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, CalendarPlusIcon, ClockIcon } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmée",
  waiting: "En attente",
  canceled: "Annulée",
};

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  confirmed: "default",
  waiting: "secondary",
  canceled: "destructive",
};

const TYPE_LABEL: Record<string, string> = {
  open_space: "Open space",
  meeting_room: "Salle de réunion",
};

export default async function DashboardPage() {
  const [user, { upcomingReservations, nextReservation, todayCount }] =
    await Promise.all([getRequiredUser(), getDashboardData()]);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold capitalize">
          Bonjour, {user.name}
        </h1>
        <p className="text-muted-foreground text-sm mt-1 capitalize">{today}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Prochaine réservation */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prochaine réservation
            </CardTitle>
            <CalendarIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {nextReservation ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">
                    {nextReservation.space?.nom ?? "Espace inconnu"}
                  </p>
                  {nextReservation.space?.type && (
                    <span className="text-xs text-muted-foreground">
                      {TYPE_LABEL[nextReservation.space.type]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {new Date(nextReservation.startTime).toLocaleDateString(
                    "fr-FR",
                    { weekday: "long", day: "numeric", month: "long" },
                  )}
                </p>
                <p className="text-sm font-medium">
                  {new Date(nextReservation.startTime).toLocaleTimeString(
                    "fr-FR",
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                  {" → "}
                  {new Date(nextReservation.endTime).toLocaleTimeString(
                    "fr-FR",
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </p>
                <Badge variant={STATUS_VARIANT[nextReservation.status]}>
                  {STATUS_LABEL[nextReservation.status]}
                </Badge>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Aucune réservation à venir
              </p>
            )}
          </CardContent>
        </Card>

        {/* Aujourd'hui */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aujourd&apos;hui
            </CardTitle>
            <ClockIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{todayCount}</p>
            <p className="text-sm text-muted-foreground mt-1">
              réservation{todayCount > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick action */}
      <Button asChild size="lg">
        <Link href="/app/bookings">
          <CalendarPlusIcon className="size-4" />
          Réserver un espace
        </Link>
      </Button>

      {/* Upcoming list */}
      {upcomingReservations.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Prochaines réservations</h2>
          <div className="space-y-2">
            {upcomingReservations.map((r) => (
              <Card key={r.id_reservation}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="space-y-0.5">
                    <p className="font-medium">
                      {r.space?.nom ?? "Espace inconnu"}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {new Date(r.startTime).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                      {" · "}
                      {new Date(r.startTime).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" → "}
                      {new Date(r.endTime).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[r.status]}>
                    {STATUS_LABEL[r.status]}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <CalendarIcon className="size-10 text-muted-foreground/40" />
            <div>
              <p className="font-medium">Aucune réservation à venir</p>
              <p className="text-sm text-muted-foreground">
                Réservez un espace pour commencer
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/app/bookings">Réserver</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
