"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { createReservation } from "@/features/reservations/reservations"
import { searchUser } from "@/features/invite/invite"
import { toast } from "sonner"
import { Users, MapPin, X } from "lucide-react"

type Space = {
  id_espace: string
  nom: string
  type: "open_space" | "meeting_room"
  capacity: number
  description: string
  status: string
}

type User = {
  id: string
  name: string
  email: string
  image: string | null
}

type Props = {
  space: Space | null
  open: boolean
  onClose: () => void
}

function getDefaultTimes() {
  const today = new Date().toISOString().split("T")[0]
  return { start: `${today}T09:00`, end: `${today}T10:00` }
}

export function ReservationDialog({ space, open, onClose }: Props) {
  const defaults = getDefaultTimes()
  const [startTime, setStartTime] = useState(defaults.start)
  const [endTime, setEndTime] = useState(defaults.end)
  const [reason, setReason] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [participants, setParticipants] = useState<User[]>([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = async (q: string) => {
    setSearchQuery(q)
    if (q.length < 2) {
      setSearchResults([])
      return
    }
    const results = await searchUser(q)
    setSearchResults(results.filter((u) => !participants.find((p) => p.id === u.id)))
  }

  const addParticipant = (user: User) => {
    setParticipants((prev) => [...prev, user])
    setSearchResults([])
    setSearchQuery("")
  }

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSubmit = () => {
    if (!space || !startTime || !endTime) {
      toast.error("Veuillez remplir les champs date de début et de fin")
      return
    }
    const start = new Date(startTime)
    const end = new Date(endTime)
    if (end <= start) {
      toast.error("L'heure de fin doit être après l'heure de début")
      return
    }
    startTransition(async () => {
      const result = await createReservation(
        start,
        end,
        space.id_espace,
        isPrivate,
        false,
        reason,
        participants.map((p) => p.id)
      )
      if (result) {
        toast.success("Réservation créée avec succès !")
        handleClose()
      } else {
        toast.error("Cet espace n'est pas disponible sur ce créneau")
      }
    })
  }

  const handleClose = () => {
    const d = getDefaultTimes()
    setStartTime(d.start)
    setEndTime(d.end)
    setReason("")
    setIsPrivate(false)
    setParticipants([])
    setSearchQuery("")
    setSearchResults([])
    onClose()
  }

  if (!space) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-4" />
            {space.nom}
          </DialogTitle>
          <div className="flex items-center gap-2 pt-1">
            <Badge variant={space.type === "meeting_room" ? "default" : "secondary"}>
              {space.type === "meeting_room" ? "Salle de réunion" : "Open space"}
            </Badge>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <Users className="size-3" />
              {space.capacity} place{space.capacity > 1 ? "s" : ""}
            </span>
          </div>
          {space.description && (
            <p className="text-sm text-muted-foreground pt-1">{space.description}</p>
          )}
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="start">Début *</Label>
              <Input
                id="start"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="end">Fin *</Label>
              <Input
                id="end"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reason">Motif</Label>
            <Textarea
              id="reason"
              placeholder="Décrivez l'objet de votre réservation…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="private" className="cursor-pointer">
              Réservation privée
            </Label>
            <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          {space.type === "meeting_room" && (
            <>
              <Separator />
              <div className="grid gap-2">
                <Label>Participants</Label>

                {participants.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {participants.map((p) => (
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
                          onClick={() => removeParticipant(p.id)}
                          className="ml-0.5 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Input
                  placeholder="Rechercher un membre…"
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
                          onClick={() => addParticipant(u)}
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
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Réservation en cours…" : "Réserver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
