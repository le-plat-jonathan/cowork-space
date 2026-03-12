"use client";

import { useState } from "react";
import { ReservationDialog } from "./reservation-dialog";

// ─── Colors ──────────────────────────────────────────────────────────────────
const PALETTE = {
  available: "#22c55e",   
  occupied:  "#ef4444",   
  mine:      "#f59e0b",   
  disabled:  "#e5e7eb",   
  selected:  "#15803d",   
};

const AVATAR_COLORS = ["#f97316", "#3b82f6", "#ec4899", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4", "#84cc16"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function hashColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Types ───────────────────────────────────────────────────────────────────
type SpaceWithReservation = {
  id_espace: string;
  nom: string;
  type: string;
  reservation: {
    id: string;
    userId: string;
    userName: string;
    userImage: string | null;
    startTime: string;
    endTime: string;
  } | null;
};

interface PlanProps {
  spaces: SpaceWithReservation[];
  currentUserId: string;
}

type DeskStatus = "available" | "occupied" | "mine" | "disabled";

interface DeskInfo {
  id: string;
  status: DeskStatus;
  occupant?: { initials: string; color: string };
}

// ─── Layout positions ────────────────────────────────────────────────────────
// Les espaces open_space de la BDD sont mappés dans cet ordre sur le plan.
const ZA_X = 38, ZA_Y = 30;
const D_W = 54, D_GAP_X = 14, D_ROW_H = 58;

const DESK_LAYOUT: [string, number, number][] = [
  // Zone A — 2 cols × 2 rows
  ["a1", ZA_X,              ZA_Y],
  ["a2", ZA_X + D_W + D_GAP_X, ZA_Y],
  ["a3", ZA_X,              ZA_Y + D_ROW_H],
  ["a4", ZA_X + D_W + D_GAP_X, ZA_Y + D_ROW_H],
  // Zone B — 2 cols × 4 rows
  ["b1", 255, 30],
  ["b2", 325, 30],
  ["b3", 255, 30 + D_ROW_H],
  ["b4", 325, 30 + D_ROW_H],
  ["b5", 255, 30 + D_ROW_H * 2],
  ["b6", 325, 30 + D_ROW_H * 2],
  ["b7", 255, 30 + D_ROW_H * 3],
  ["b8", 325, 30 + D_ROW_H * 3],
];

// Les meeting_room de la BDD sont mappés sur ces salles dans cet ordre.
const MEETING_ROOMS_LAYOUT = [
  { key: "salle-a",  x: 24,  y: 178, w: 198, h: 130, label: "Salle A — Conf.", chairCount: 10 },
  { key: "newton",   x: 458, y: 18,  w: 232, h: 160, label: "Newton Conf.",     chairCount: 12 },
  { key: "mandela",  x: 238, y: 298, w: 210, h: 130, label: "Mandela Conf.",    chairCount: 10 },
];

// ─── SVG Sub-components ──────────────────────────────────────────────────────
function Avatar({ x, y, initials, color }: { x: number; y: number; initials: string; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill={color} stroke="white" strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={7} fontWeight="700" fill="white"
        fontFamily="system-ui" style={{ pointerEvents: "none", userSelect: "none" }}>
        {initials}
      </text>
    </g>
  );
}

function Desk({ id, x, y, w = 54, h = 28, status, occupant, selected, onSelect }: {
  id: string; x: number; y: number; w?: number; h?: number;
  status: string; occupant?: { initials: string; color: string };
  selected: boolean; onSelect: (id: string) => void;
}) {
  const cx = x + w / 2;
  const fill = selected ? PALETTE.selected : PALETTE[status as keyof typeof PALETTE] ?? PALETTE.disabled;
  const clickable = status === "available";
  return (
    <g onClick={() => clickable && onSelect(id)} style={{ cursor: clickable ? "pointer" : "default" }}>
      <rect x={cx - 10} y={y + h + 3} width={20} height={11} rx={5}
        fill={fill} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
      <rect x={x} y={y} width={w} height={h} rx={4}
        fill={fill} stroke={selected ? "#14532d" : "rgba(255,255,255,0.6)"} strokeWidth={selected ? 2 : 1} />
      <rect x={cx - 9} y={y + 5} width={18} height={11} rx={2} fill="rgba(0,0,0,0.13)" />
      {occupant && <Avatar x={cx} y={y + h + 8} initials={occupant.initials} color={occupant.color} />}
    </g>
  );
}

function Room({ x, y, w, h, label, bg = "#f9f9f6", border = "#e5e7eb" }: {
  x: number; y: number; w: number; h: number; label: string;
  bg?: string; border?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={bg} stroke={border} strokeWidth={1.5} />
      {label && (
        <text x={x + w / 2} y={y + h / 2 + 4}
          textAnchor="middle" fontSize={10}
          fill="#374151" fontWeight="600" fontFamily="system-ui" style={{ userSelect: "none" }}>
          {label}
        </text>
      )}
    </g>
  );
}

function MeetingRoom({ x, y, w, h, label, chairCount = 10, status, selected, onClick }: {
  x: number; y: number; w: number; h: number; label: string; chairCount?: number;
  status: DeskStatus; selected: boolean; onClick: () => void;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2 + 6;
  const rx = w * 0.35;
  const ry = h * 0.26;
  const orbitX = rx + 13;
  const orbitY = ry + 12;

  const clickable = status === "available";

  // Table + border color based on status
  const tableFill = selected ? "#bbf7d0" : status === "occupied" ? "#fecaca" : status === "mine" ? "#fef3c7" : "#d1fae5";
  const tableStroke = selected ? "#15803d" : status === "occupied" ? "#f87171" : status === "mine" ? "#fbbf24" : "#6ee7b7";
  const roomBg = selected ? "#f0fdf4" : status === "occupied" ? "#fef2f2" : status === "mine" ? "#fffbeb" : "#f0fdf4";
  const roomBorder = selected ? "#86efac" : status === "occupied" ? "#fca5a5" : status === "mine" ? "#fde68a" : "#86efac";

  const chairs = Array.from({ length: chairCount }, (_, i) => {
    const angle = (i / chairCount) * 2 * Math.PI - Math.PI / 2;
    return { cx: cx + orbitX * Math.cos(angle), cy: cy + orbitY * Math.sin(angle) };
  });

  return (
    <g onClick={() => clickable && onClick()} style={{ cursor: clickable ? "pointer" : "default" }}>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={roomBg} stroke={roomBorder} strokeWidth={selected ? 2.5 : 1.5} strokeDasharray="5 3" />
      <text x={cx} y={y + 13} textAnchor="middle" fontSize={10}
        fill="#374151" fontWeight="600" fontFamily="system-ui" style={{ userSelect: "none" }}>
        {label}
      </text>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={tableFill} stroke={tableStroke} strokeWidth={1.5} />
      {chairs.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={5} fill={tableStroke} stroke="white" strokeWidth={1} />
      ))}
    </g>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
const LEGEND = [
  { color: PALETTE.available, label: "Disponible" },
  { color: PALETTE.occupied,  label: "Occupé" },
  { color: PALETTE.mine,      label: "Ma réservation" },
  { color: PALETTE.disabled,  label: "Indisponible" },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Plan({ spaces, currentUserId }: PlanProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Séparer open_space et meeting_room
  const openSpaces = spaces.filter((s) => s.type === "open_space");
  const meetingRoomSpaces = spaces.filter((s) => s.type === "meeting_room");

  // Mapper les open_space sur les positions de bureau
  const deskMap = new Map<string, DeskInfo>();
  DESK_LAYOUT.forEach(([slotId], i) => {
    const space = openSpaces[i];
    if (!space) {
      deskMap.set(slotId, { id: slotId, status: "disabled" });
      return;
    }
    const isMine = space.reservation?.userId === currentUserId;
    const status: DeskStatus = space.reservation
      ? isMine ? "mine" : "occupied"
      : "available";
    deskMap.set(slotId, {
      id: space.id_espace,
      status,
      occupant: space.reservation
        ? { initials: getInitials(space.reservation.userName), color: hashColor(space.reservation.userId) }
        : undefined,
    });
  });

  // Mapper les meeting_room sur les positions de salle
  const meetingMap = new Map<string, DeskInfo>();
  MEETING_ROOMS_LAYOUT.forEach((room, i) => {
    const space = meetingRoomSpaces[i];
    if (!space) {
      meetingMap.set(room.key, { id: room.key, status: "disabled" });
      return;
    }
    const isMine = space.reservation?.userId === currentUserId;
    const status: DeskStatus = space.reservation
      ? isMine ? "mine" : "occupied"
      : "available";
    meetingMap.set(room.key, {
      id: space.id_espace,
      status,
    });
  });

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const availableCount = [...deskMap.values(), ...meetingMap.values()].filter((d) => d.status === "available").length;

  return (
    <div className="flex h-full w-full flex-col gap-5 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Réserver un espace</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {availableCount} espace{availableCount > 1 ? "s" : ""} disponible{availableCount > 1 ? "s" : ""}
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {LEGEND.map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
            <div style={{ width: 11, height: 11, borderRadius: 3, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* SVG Floor Plan — full width */}
      <div className="w-full rounded-2xl border border-border bg-white p-4 shadow-sm overflow-x-auto">
        <svg viewBox="0 0 700 440" className="block w-full h-auto" style={{ minWidth: 600 }}>

          {/* Outer shell */}
          <rect x={8} y={8} width={684} height={424} rx={10} fill="#fafaf8" stroke="#e5e7eb" strokeWidth={1.5} />

          {/* ── Zone A wing (left column) */}
          <Room x={18} y={18} w={210} h={410} label="" bg="#f9f9f6" border="#e5e7eb" />
          <text x={30} y={26} fontSize={9} fill="#9ca3af" fontFamily="system-ui" fontWeight="600" letterSpacing="0.06em">ZONE A</text>

          {/* Meeting room inside Zone A (bottom half) */}
          {(() => {
            const room = MEETING_ROOMS_LAYOUT[0];
            const info = meetingMap.get(room.key)!;
            return (
              <MeetingRoom x={room.x} y={room.y} w={room.w} h={room.h}
                label={room.label} chairCount={room.chairCount}
                status={info.status} selected={selectedId === info.id}
                onClick={() => handleSelect(info.id)} />
            );
          })()}

          {/* ── Zone B (middle column) */}
          <Room x={238} y={18} w={210} h={270} label="" bg="#f9f9f6" border="#e5e7eb" />
          <text x={250} y={26} fontSize={9} fill="#9ca3af" fontFamily="system-ui" fontWeight="600" letterSpacing="0.06em">ZONE B</text>

          {/* ── Newton Conf. (top right) */}
          {(() => {
            const room = MEETING_ROOMS_LAYOUT[1];
            const info = meetingMap.get(room.key)!;
            return (
              <MeetingRoom x={room.x} y={room.y} w={room.w} h={room.h}
                label={room.label} chairCount={room.chairCount}
                status={info.status} selected={selectedId === info.id}
                onClick={() => handleSelect(info.id)} />
            );
          })()}

          {/* ── Mandela Conf. (bottom, spans under Zone B) */}
          {(() => {
            const room = MEETING_ROOMS_LAYOUT[2];
            const info = meetingMap.get(room.key)!;
            return (
              <MeetingRoom x={room.x} y={room.y} w={room.w} h={room.h}
                label={room.label} chairCount={room.chairCount}
                status={info.status} selected={selectedId === info.id}
                onClick={() => handleSelect(info.id)} />
            );
          })()}

          {/* ── Bottom right — Phone Booth + Lobby */}
          <Room x={458} y={188} w={100} h={240} label="Phone Booth" bg="#fefce8" border="#fde68a" />
          <Room x={568} y={188} w={122} h={240} label="Lobby"       bg="#f9f9f6" border="#e5e7eb" />

          {/* Separator lines */}
          <line x1={238} y1={18}  x2={238} y2={428} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />
          <line x1={458} y1={18}  x2={458} y2={428} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 4" />

          {/* ── Desks */}
          {DESK_LAYOUT.map(([slotId, x, y]) => {
            const info = deskMap.get(slotId);
            if (!info) return null;
            return (
              <Desk key={slotId} id={info.id} x={x} y={y}
                status={info.status} occupant={info.occupant}
                selected={selectedId === info.id} onSelect={handleSelect} />
            );
          })}

        </svg>
      </div>

      {/* Reservation dialog */}
      <ReservationDialog
        tableId={selectedId}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedId(null);
        }}
      />
    </div>
  );
}
