"use client";

import { useState } from "react";
import { Image, Layer, Rect, Stage } from "react-konva";
import useImage from "use-image";
import { ReservationDialog } from "./reservation-dialog";

const TABLES = [
  { id: "t1", x: 228, y: 247, width: 51, height: 84, fill: "#22c55e" },
  { id: "t2", x: 408, y: 247, width: 40, height: 90, fill: "#DE870A" },
  { id: "t3", x: 654, y: 348, width: 22, height: 50, fill: "#FF0000" },
  { id: "t4", x: 728, y: 348, width: 22, height: 50, fill: "#22c55e" },
  { id: "t5", x: 795, y: 348, width: 22, height: 50, fill: "#22c55e" },
  { id: "t6", x: 795, y: 348, width: 22, height: 55, fill: "#22c55e" },
  { id: "t7", x: 438, y: 440, width: 22, height: 55, fill: "#22c55e" },
  { id: "t8", x: 512, y: 440, width: 22, height: 55, fill: "#22c55e" },
  { id: "t9", x: 584, y: 440, width: 22, height: 55, fill: "#22c55e" },
  { id: "t10", x: 656, y: 440, width: 22, height: 55, fill: "#22c55e" },
  { id: "t11", x: 728, y: 440, width: 22, height: 55, fill: "#22c55e" },
  { id: "t12", x: 795, y: 440, width: 22, height: 55, fill: "#22c55e" },
  { id: "t13", x: 438, y: 512, width: 22, height: 55, fill: "#22c55e" },
  { id: "t14", x: 512, y: 512, width: 22, height: 55, fill: "#22c55e" },
  { id: "t15", x: 584, y: 512, width: 22, height: 55, fill: "#22c55e" },
  { id: "t16", x: 656, y: 512, width: 22, height: 55, fill: "#22c55e" },
  { id: "t17", x: 728, y: 512, width: 22, height: 55, fill: "#22c55e" },
  { id: "t18", x: 795, y: 512, width: 22, height: 55, fill: "#22c55e" },
  { id: "t19", x: 438, y: 584, width: 22, height: 55, fill: "#22c55e" },
  { id: "t20", x: 512, y: 584, width: 22, height: 55, fill: "#22c55e" },
  { id: "t21", x: 584, y: 584, width: 22, height: 55, fill: "#22c55e" },
  { id: "t22", x: 656, y: 584, width: 22, height: 55, fill: "#22c55e" },
  { id: "t23", x: 728, y: 584, width: 22, height: 55, fill: "#22c55e" },
  { id: "t24", x: 795, y: 584, width: 22, height: 55, fill: "#22c55e" },
  { id: "t25", x: 438, y: 658, width: 22, height: 55, fill: "#22c55e" },
  { id: "t26", x: 512, y: 658, width: 22, height: 55, fill: "#22c55e" },
  { id: "t27", x: 584, y: 658, width: 22, height: 55, fill: "#22c55e" },
  { id: "t28", x: 656, y: 658, width: 22, height: 55, fill: "#22c55e" },
  { id: "t29", x: 728, y: 658, width: 22, height: 55, fill: "#22c55e" },
  { id: "t30", x: 795, y: 658, width: 22, height: 55, fill: "#22c55e" },
  { id: "t31", x: 336, y: 520, width: 36, height: 50, fill: "#22c55e" },
];

export default function Plan() {
  const [image] = useImage("/plan.png");
  const [scale, setScale] = useState(0.5);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const [selectedTable, setSelectedTable] = useState<(typeof TABLES)[number] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTableClick = (table: (typeof TABLES)[number]) => {
    setSelectedTable(table);
    setDialogOpen(true);
  };

  return (
    <>
      <Stage
        width={500}
        height={500}
        x={pos.x}
        y={pos.y}
        scaleX={scale}
        scaleY={scale}
        draggable
        onDragEnd={(e) => {
          setPos({ x: e.target.x(), y: e.target.y() });
        }}
        className="cursor-grab"
      >
        <Layer>
          <Image image={image} width={1024} height={1024} />
        </Layer>

        <Layer>
          {TABLES.map((table) => (
            <Rect
              key={table.id}
              x={table.x}
              y={table.y}
              width={table.width}
              height={table.height}
              fill={table.fill}
              opacity={0.7}
              cornerRadius={4}
              onClick={() => handleTableClick(table)}
              onTap={() => handleTableClick(table)}
            />
          ))}
        </Layer>
      </Stage>

      <ReservationDialog
        tableId={selectedTable?.id ?? null}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
