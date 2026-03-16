"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone } from "lucide-react"

type Participant = {
  id: string
  name: string
  email: string
  phone: string | null
  image: string | null
  status: string
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  declined: "Déclinée",
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  accepted: "default",
  declined: "destructive",
}

export function ParticipantInfoDialog({ participant }: { participant: Participant }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-primary underline-offset-2 hover:underline cursor-pointer"
      >
        {participant.name}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[340px]">
          <DialogHeader>
            <DialogTitle>Informations du participant</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-3 pt-1">
            <Avatar className="size-16">
              <AvatarImage src={participant.image ?? undefined} />
              <AvatarFallback className="text-xl">{participant.name[0]}</AvatarFallback>
            </Avatar>

            <div className="text-center">
              <p className="font-semibold text-base">{participant.name}</p>
              <Badge variant={STATUS_VARIANT[participant.status] ?? "secondary"} className="mt-1.5">
                {STATUS_LABEL[participant.status] ?? participant.status}
              </Badge>
            </div>

            <Separator />

            <div className="w-full space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm break-all">{participant.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {participant.phone ?? "Non renseigné"}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
