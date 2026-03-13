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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  canceledReservation,
  updateReservation,
} from "@/features/reservations/reservations";
import { useMutation } from "@tanstack/react-query";
import { PencilIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Space = { id_espace: string; nom: string; type: string };

type Reservation = {
  id_reservation: string;
  startTime: Date;
  endTime: Date;
  reason: string | null;
  is_private: boolean;
  id_space: string;
};

function toDateInput(d: Date) {
  return new Date(d).toISOString().split("T")[0];
}

function toTimeInput(d: Date) {
  return new Date(d).toTimeString().slice(0, 5);
}

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
      return updateReservation(
        reservation.id_reservation,
        newStart,
        newEnd,
        spaceId,
        undefined,
        undefined,
        reason || undefined,
      );
    },
    onSuccess: (ok) => {
      if (ok) {
        toast.success("Réservation modifiée");
        setEditOpen(false);
        router.refresh();
      } else {
        toast.error("Créneau non disponible pour cet espace");
      }
    },
    onError: (e) => toast.error(e.message ?? "Erreur lors de la modification"),
  });

  return (
    <>
      <div className="flex gap-1.5 shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditOpen(true)}
        >
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
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
