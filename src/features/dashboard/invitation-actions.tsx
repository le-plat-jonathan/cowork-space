"use client";

import { Button } from "@/components/ui/button";
import { answerToInvitation } from "@/features/invite/invite";
import { CheckIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function InvitationActions({ idReservation }: { idReservation: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handle = (answer: "accepted" | "declined") => {
    startTransition(async () => {
      await answerToInvitation(idReservation, answer);
      toast.success(answer === "accepted" ? "Invitation acceptée" : "Invitation refusée");
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2 shrink-0">
      <Button
        size="sm"
        variant="outline"
        className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
        disabled={isPending}
        onClick={() => handle("accepted")}
      >
        <CheckIcon className="size-3.5 mr-1" />
        Accepter
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive border-destructive hover:bg-destructive/10"
        disabled={isPending}
        onClick={() => handle("declined")}
      >
        <XIcon className="size-3.5 mr-1" />
        Refuser
      </Button>
    </div>
  );
}
