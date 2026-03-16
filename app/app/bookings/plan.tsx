"use client"

import { useRef, useState } from "react"
import { ReservationDialog } from "@/features/reservations/reservation-dialog"

type SpaceWithAvailability = {
  id_espace: string
  nom: string
  type: string
  capacity: number
  description: string
  position_x: number
  position_y: number
  status: string
  currentReservations: number
}

type Props = {
  spaces: SpaceWithAvailability[]
}

// Taille des divs selon le type / capacité
function getSpaceSize(space: SpaceWithAvailability): { w: number; h: number } {
  if (space.type === "meeting_room") return { w: 51, h: 84 }
  if (space.capacity >= 10) return { w: 36, h: 50 }
  return { w: 22, h: 55 }
}

// Couleur selon disponibilité
function getSpaceColor(space: SpaceWithAvailability): string {
  const available = space.capacity - space.currentReservations

  if (space.type === "meeting_room") {
    return available > 0 ? "#22c55e" : "#ef4444"
  }

  // open_space
  if (available <= 0) return "#ef4444"
  if (available > space.capacity / 2) return "#22c55e"
  return "#f97316"
}

const PLAN_SIZE = 1024

export default function Plan({ spaces }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.6)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [selectedSpace, setSelectedSpace] = useState<SpaceWithAvailability | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isDragging = useRef(false)
  const hasDragged = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.9 : 1.1
    setScale((s) => Math.min(Math.max(s * factor, 0.2), 2))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    hasDragged.current = false
    dragStart.current = { x: e.clientX, y: e.clientY, tx: translate.x, ty: translate.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged.current = true
    setTranslate({ x: dragStart.current.tx + dx, y: dragStart.current.ty + dy })
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleSpaceClick = (e: React.MouseEvent, space: SpaceWithAvailability) => {
    e.stopPropagation()
    if (hasDragged.current) return
    setSelectedSpace(space)
    setDialogOpen(true)
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Légende */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs border">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#22c55e]" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#f97316]" />
          Partiellement
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#ef4444]" />
          Indisponible
        </span>
        <span className="text-muted-foreground ml-1">Scroll pour zoomer</span>
      </div>

      {/* Plan */}
      <div
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "top left",
          width: PLAN_SIZE,
          height: PLAN_SIZE,
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/plan.png"
          width={PLAN_SIZE}
          height={PLAN_SIZE}
          alt="Plan de l'espace"
          draggable={false}
        />

        {spaces.map((space) => {
          const { w, h } = getSpaceSize(space)
          const color = getSpaceColor(space)
          const available = space.capacity - space.currentReservations

          return (
            <div
              key={space.id_espace}
              title={`${space.nom} — ${available}/${space.capacity} place${space.capacity > 1 ? "s" : ""} disponible${available > 1 ? "s" : ""}`}
              style={{
                position: "absolute",
                left: space.position_x,
                top: space.position_y,
                width: w,
                height: h,
                backgroundColor: color,
                opacity: 0.75,
                borderRadius: 4,
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
              onClick={(e) => handleSpaceClick(e, space)}
            />
          )
        })}
      </div>

      <ReservationDialog
        space={selectedSpace}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}
