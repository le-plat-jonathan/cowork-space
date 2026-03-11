"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createReservation } from "@/features/reservations/reservations";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface ReservationDialogProps {
  tableId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationDialog({
  tableId,
  open,
  onOpenChange,
}: ReservationDialogProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [reason, setReason] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!tableId) throw new Error("Aucune table sélectionnée");

      return createReservation({
        id_space: tableId,
        startTime: `${date}T${startTime}:00`,
        endTime: `${date}T${endTime}:00`,
        reason: reason || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Réservation confirmée !");
      onOpenChange(false);
      setReason("");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la réservation");
    },
  });

  if (!tableId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Réserver cette table</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Début</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fin</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Motif{" "}
              <span className="text-muted-foreground font-normal">
                (optionnel)
              </span>
            </label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex : réunion d'équipe, travail concentré..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Réservation..." : "Réserver"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
