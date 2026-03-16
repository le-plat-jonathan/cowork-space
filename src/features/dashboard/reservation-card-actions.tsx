"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { inviteUserToReservation, searchUser } from "@/features/invite/invite";
import {
  canceledReservation,
  updateReservation,
} from "@/features/reservations/reservations";
import { useMutation } from "@tanstack/react-query";
import { PencilIcon, X, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Space = { id_espace: string; nom: string; type: string };

type Participant = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  status: string;
};

type Reservation = {
  id_reservation: string;
  startTime: Date;
  endTime: Date;
  reason: string | null;
  is_private: boolean;
  id_space: string;
  space: { id_espace: string; nom: string; type: string } | null;
  participants: Participant[];
};

const INVITATION_STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  declined: "Déclinée",
};

const INVITATION_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  accepted: "default",
  declined: "destructive",
};

function toDateInput(d: Date) {
  return new Date(d).toISOString().split("T")[0];
}

function toTimeInput(d: Date) {
  return new Date(d).toTimeString().slice(0, 5);
}

type UserSearchResult = { id: string; name: string; email: string; image: string | null };

export function ReservationCardActions({
  reservation,
  allSpaces,
}: {
  reservation: Reservation;
  allSpaces: Space[];
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [date, setDate] = useState(toDateInput(reservation.startTime));
  const [startTime, setStartTime] = useState(toTimeInput(reservation.startTime));
  const [endTime, setEndTime] = useState(toTimeInput(reservation.endTime));
  const [reason, setReason] = useState(reservation.reason ?? "");
  const [spaceId, setSpaceId] = useState(reservation.id_space);

  // Invitations
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [newParticipants, setNewParticipants] = useState<UserSearchResult[]>([]);

  const selectedSpaceType = allSpaces.find((s) => s.id_espace === spaceId)?.type;
  const isMeetingRoom = selectedSpaceType === "meeting_room";

  const existingParticipantIds = new Set(reservation.participants.map((p) => p.id));

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = await searchUser(q);
    setSearchResults(
      results.filter(
        (u) =>
          !existingParticipantIds.has(u.id) &&
          !newParticipants.find((p) => p.id === u.id)
      )
    );
  };

  const addNewParticipant = (user: UserSearchResult) => {
    setNewParticipants((prev) => [...prev, user]);
    setSearchResults([]);
    setSearchQuery("");
  };

  const removeNewParticipant = (id: string) => {
    setNewParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClose = () => {
    setEditOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setNewParticipants([]);
  };

  const cancelMutation = useMutation({
    mutationFn: () => canceledReservation(reservation.id_reservation),
    onSuccess: (ok) => {
      if (ok) {
        toast.success("Réservation annulée");
        router.refresh();
      } else {
        toast.error("Impossible d'annuler cette réservation");
      }
    },
    onError: () => toast.error("Erreur lors de l'annulation"),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const newStart = new Date(`${date}T${startTime}`);
      const newEnd = new Date(`${date}T${endTime}`);
      if (newEnd <= newStart) throw new Error("L'heure de fin doit être après le début");

      const ok = await updateReservation(
        reservation.id_reservation,
        newStart,
        newEnd,
        spaceId,
        undefined,
        undefined,
        reason || undefined,
      );
      if (!ok) return false;

      // Inviter les nouveaux participants
      for (const p of newParticipants) {
        await inviteUserToReservation(reservation.id_reservation, p.id);
      }
      return true;
    },
    onSuccess: (ok) => {
      if (ok) {
        toast.success("Réservation modifiée");
        handleClose();
        router.refresh();
      } else {
        toast.error("Créneau non disponible pour cet espace");
      }
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur lors de la modification"),
  });

  return (
    <>
      <div className="flex gap-1.5 shrink-0">
        <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
          <PencilIcon className="size-3.5" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setCancelOpen(true)}
          disabled={cancelMutation.isPending}
        >
          <XIcon className="size-3.5" />
        </Button>
      </div>

      {/* Dialog annulation */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La réservation sera marquée comme annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retour</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => cancelMutation.mutate()}
            >
              Confirmer l&apos;annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog modification */}
      <Dialog open={editOpen} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Modifier la réservation</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Espace</Label>
              <Select value={spaceId} onValueChange={setSpaceId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allSpaces.map((s) => (
                    <SelectItem key={s.id_espace} value={s.id_espace}>
                      {s.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Début</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Fin</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Motif</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optionnel"
              />
            </div>

            {/* Section participants — seulement pour les salles de réunion */}
            {isMeetingRoom && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Participants</Label>

                  {/* Participants existants */}
                  {reservation.participants.length > 0 && (
                    <div className="space-y-1.5">
                      {reservation.participants.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarImage src={p.image ?? undefined} />
                              <AvatarFallback className="text-xs">{p.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{p.name}</span>
                          </div>
                          <Badge
                            variant={INVITATION_STATUS_VARIANT[p.status] ?? "secondary"}
                            className="text-xs"
                          >
                            {INVITATION_STATUS_LABEL[p.status] ?? p.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nouveaux participants à ajouter */}
                  {newParticipants.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newParticipants.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-1 bg-secondary rounded-full pl-1 pr-2 py-0.5"
                        >
                          <Avatar className="size-5">
                            <AvatarImage src={p.image ?? undefined} />
                            <AvatarFallback className="text-xs">{p.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{p.name}</span>
                          <button
                            onClick={() => removeNewParticipant(p.id)}
                            className="ml-0.5 text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recherche */}
                  <Input
                    placeholder="Inviter un membre…"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />

                  {searchResults.length > 0 && (
                    <ScrollArea className="max-h-36 rounded-md border">
                      <div className="p-1">
                        {searchResults.map((u) => (
                          <button
                            key={u.id}
                            className="flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left"
                            onClick={() => addNewParticipant(u)}
                          >
                            <Avatar className="size-6">
                              <AvatarImage src={u.image ?? undefined} />
                              <AvatarFallback>{u.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={updateMutation.isPending}>
              Annuler
            </Button>
            <Button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
