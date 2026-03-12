"use client";

import { useState } from "react";
import { ReservationDialog } from "./reservation-dialog";

// ─── Theme ───────────────────────────────────────────────
const COLORS = {
  available: "#22c55e",
  occupied: "#ef4444",
  mine: "#f59e0b",
  unavailable: "#d1d5db",
  textLight: "#6b7280",
};

const AVATAR_COLORS = ["#f97316", "#3b82f6", "#ec4899", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4", "#84cc16"];
const AVATAR_INITIALS = ["AB", "MC", "SK", "TL", "RD", "JW", "NP", "EG"];

// ─── Types ───────────────────────────────────────────────
type DeskStatus = "available" | "occupied" | "empty";

interface DeskData {
  id: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotation?: number;
  status: DeskStatus;
  occupant?: number;
}

// ─── SVG Sub-components ──────────────────────────────────
function Avatar({ x, y, color, initials }: { x: number; y: number; color: string; initials: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill={color} stroke="white" strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={8} fill="white" fontWeight="700" fontFamily="system-ui">
        {initials}
      </text>
    </g>
  );
}

function Desk({
  x, y, w = 52, h = 28, rotation = 0, status, id, selected, onClick, occupant,
}: DeskData & { selected: boolean; onClick: (id: number) => void }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const fill = selected
    ? COLORS.mine
    : status === "occupied"
      ? COLORS.occupied
      : status === "available"
        ? COLORS.available
        : COLORS.unavailable;

  return (
    <g
      transform={`rotate(${rotation}, ${cx}, ${cy})`}
      onClick={() => status !== "empty" && onClick(id)}
      style={{ cursor: status !== "empty" ? "pointer" : "default" }}
    >
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={selected ? "#92400e" : "#fff"} strokeWidth={selected ? 2 : 1} />
      <rect x={x + w / 2 - 8} y={y + 4} width={16} height={10} rx={2} fill="rgba(0,0,0,0.12)" />
      <rect x={x + w / 2 - 9} y={y + h + 3} width={18} height={10} rx={5} fill={fill} stroke="rgba(0,0,0,0.1)" strokeWidth={1} />
      {occupant !== undefined && (
        <Avatar
          x={x + w / 2}
          y={y + h + 8}
          color={AVATAR_COLORS[occupant % AVATAR_COLORS.length]}
          initials={AVATAR_INITIALS[occupant % AVATAR_INITIALS.length]}
        />
      )}
    </g>
  );
}

function Room({ x, y, w, h, label, type = "meeting" }: {
  x: number; y: number; w: number; h: number; label: string;
  type?: "meeting" | "phone" | "office" | "none";
}) {
  const fill = type === "meeting" ? "#f0fdf4" : type === "phone" ? "#fef9c3" : type === "office" ? "#eff6ff" : "#fafafa";
  const stroke = type === "meeting" ? "#86efac" : type === "phone" ? "#fde68a" : type === "office" ? "#bfdbfe" : "#e5e7eb";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5}
        strokeDasharray={type === "meeting" ? "4 2" : "none"} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10} fill="#374151" fontWeight="600" fontFamily="system-ui">
        {label}
      </text>
    </g>
  );
}

// ─── Desk data ───────────────────────────────────────────
const INITIAL_DESKS: DeskData[] = [
  // Left cluster
  { id: 1, x: 42, y: 100, status: "occupied", occupant: 0 },
  { id: 2, x: 102, y: 100, status: "occupied", occupant: 1 },
  { id: 3, x: 42, y: 155, status: "occupied", occupant: 2 },
  { id: 4, x: 102, y: 155, status: "available" },
  // Center-top cluster
  { id: 5, x: 280, y: 100, status: "occupied", occupant: 3 },
  { id: 6, x: 340, y: 100, status: "occupied", occupant: 4 },
  { id: 7, x: 280, y: 155, status: "available" },
  { id: 8, x: 340, y: 155, status: "occupied", occupant: 5 },
  // Center-bottom cluster
  { id: 9, x: 280, y: 215, status: "occupied", occupant: 6 },
  { id: 10, x: 340, y: 215, status: "available" },
  { id: 11, x: 280, y: 270, status: "occupied", occupant: 7 },
  { id: 12, x: 340, y: 270, status: "available" },
  // Right cluster
  { id: 13, x: 480, y: 130, status: "available" },
  { id: 14, x: 480, y: 185, status: "available" },
  { id: 15, x: 480, y: 240, status: "occupied", occupant: 3 },
  { id: 16, x: 540, y: 130, status: "available" },
  { id: 17, x: 540, y: 185, status: "occupied", occupant: 2 },
  { id: 18, x: 540, y: 240, status: "available" },
];

// ─── Main component ─────────────────────────────────────
export default function Plan() {
  const [selected, setSelected] = useState<number | null>(null);
  const [booked, setBooked] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeskClick = (id: number) => {
    const desk = INITIAL_DESKS.find((d) => d.id === id);
    if (!desk) return;

    const effectiveStatus = booked.has(id) ? "occupied" : desk.status;
    if (effectiveStatus === "available") {
      setSelected(id);
      setDialogOpen(true);
    }
  };

  const desks = INITIAL_DESKS.map((d) => ({
    ...d,
    status: booked.has(d.id) ? ("occupied" as const) : d.status,
    selected: d.id === selected,
    onClick: handleDeskClick,
  }));

  const available = desks.filter((d) => d.status === "available").length;

  return (
    <div className="flex h-full w-full flex-col gap-5 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Réserver un bureau</h1>
        <p className="text-sm text-muted-foreground mt-1">Étage 2 · Cowork Space</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5">
        {[
          { color: COLORS.available, label: `${available} disponible${available > 1 ? "s" : ""}` },
          { color: COLORS.occupied, label: "Réservé" },
          { color: COLORS.mine, label: "Ma réservation" },
          { color: COLORS.unavailable, label: "Indisponible" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-3 w-3 rounded-sm" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Floor plan */}
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm overflow-x-auto">
        <svg width={680} height={420} className="block">
          {/* Outer wall */}
          <rect x={10} y={10} width={660} height={400} rx={10} fill="#fafaf7" stroke="#d1d5db" strokeWidth={2} />

          {/* Rooms */}
          <Room x={30} y={20} w={180} h={280} label="" type="none" />
          <Room x={370} y={20} w={110} h={70} label="Bureau 57" type="office" />
          <Room x={490} y={20} w={150} h={70} label="Salle Newton" type="meeting" />
          <Room x={30} y={320} w={100} h={70} label="Phone Booth" type="phone" />
          <Room x={140} y={320} w={90} h={70} label="Accueil" type="none" />
          <Room x={370} y={330} w={180} h={70} label="Salle Mandela" type="meeting" />
          <Room x={560} y={330} w={100} h={70} label="Bureau 62" type="office" />

          {/* Cluster labels */}
          <text x={65} y={95} fontSize={10} fill={COLORS.textLight} fontFamily="system-ui" fontWeight="500">
            Desk Area
          </text>
          <text x={295} y={95} fontSize={10} fill={COLORS.textLight} fontFamily="system-ui" fontWeight="500">
            Desk Area
          </text>

          {/* Corridor dividers */}
          <line x1={240} y1={20} x2={240} y2={310} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />
          <line x1={460} y1={100} x2={460} y2={310} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />

          {/* Desks */}
          {desks.map((d) => (
            <Desk key={d.id} {...d} />
          ))}
        </svg>
      </div>

      {/* Reservation dialog */}
      <ReservationDialog
        tableId={selected ? `desk-${selected}` : null}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
