import { getDashboardData, getPendingInvitations } from "@/features/dashboard/dashboard.action";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReservationCardActions } from "@/features/dashboard/reservation-card-actions";
import { ParticipantInfoDialog } from "@/features/dashboard/participant-info-dialog";
import { InvitationActions } from "@/features/dashboard/invitation-actions";
import { BellIcon, CalendarIcon, CalendarPlusIcon, UsersIcon } from "lucide-react";
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
  const [
    user,
    { upcomingReservations, nextReservation, allSpaces },
    pendingInvitations,
  ] = await Promise.all([getRequiredUser(), getDashboardData(), getPendingInvitations()]);

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
                {nextReservation.reason && (
                  <p className="text-sm text-muted-foreground italic">
                    {nextReservation.reason}
                  </p>
                )}
                {nextReservation.participants.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <UsersIcon className="size-3.5 text-muted-foreground shrink-0" />
                    {nextReservation.participants.map((p, i) => (
                      <span key={p.id} className="text-sm">
                        <ParticipantInfoDialog participant={p} />
                        {i < nextReservation.participants.length - 1 && (
                          <span className="text-muted-foreground">,</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[nextReservation.status]}>
                    {STATUS_LABEL[nextReservation.status]}
                  </Badge>
                  <ReservationCardActions
                    reservation={nextReservation}
                    allSpaces={allSpaces}
                  />
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Aucune réservation à venir
              </p>
            )}
          </CardContent>
        </Card>

        {/* Notifications / invitations en attente */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mes invitations
            </CardTitle>
            <div className="flex items-center gap-1.5">
              {pendingInvitations.length > 0 && (
                <span className="flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {pendingInvitations.length}
                </span>
              )}
              <BellIcon className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-0">
            {pendingInvitations.length === 0 ? (
              <p className="text-muted-foreground text-sm px-6 pb-4">
                Aucune invitation en attente
              </p>
            ) : (
              <ScrollArea className="max-h-52">
                <div className="px-4 pb-4 space-y-3">
                  {pendingInvitations.map((inv) => (
                    <div key={inv.id_reservation} className="rounded-lg border p-3 space-y-2">
                      <div className="space-y-0.5">
                        <p className="font-medium text-sm">
                          {inv.space?.nom ?? "Espace inconnu"}
                        </p>
                        {inv.reason && (
                          <p className="text-xs text-muted-foreground italic">
                            {inv.reason}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground capitalize">
                          {new Date(inv.startTime).toLocaleDateString("fr-FR", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                          {" · "}
                          {new Date(inv.startTime).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" → "}
                          {new Date(inv.endTime).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <InvitationActions idReservation={inv.id_reservation} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
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
                    {r.reason && (
                      <p className="text-sm text-muted-foreground italic">
                        {r.reason}
                      </p>
                    )}
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
                    {r.participants.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <UsersIcon className="size-3 text-muted-foreground shrink-0" />
                        {r.participants.map((p, i) => (
                          <span key={p.id} className="text-sm">
                            <ParticipantInfoDialog participant={p} />
                            {i < r.participants.length - 1 && (
                              <span className="text-muted-foreground">,</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_VARIANT[r.status]}>
                      {STATUS_LABEL[r.status]}
                    </Badge>
                    <ReservationCardActions
                      reservation={r}
                      allSpaces={allSpaces}
                    />
                  </div>
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
