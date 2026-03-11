"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CalendarIcon } from "lucide-react";

const chartConfig = {
  reservations: {
    label: "Reservations",
    color: "oklch(0.65 0.2 160)",
  },
} satisfies ChartConfig;

const emptyWeekData = [
  { day: "Lun", reservations: 0 },
  { day: "Mar", reservations: 0 },
  { day: "Mer", reservations: 0 },
  { day: "Jeu", reservations: 0 },
  { day: "Ven", reservations: 0 },
  { day: "Sam", reservations: 0 },
  { day: "Dim", reservations: 0 },
];

function ReservationChartPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <CalendarIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={emptyWeekData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="reservations"
              fill="var(--color-reservations)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Aucune donnee de reservation disponible
        </p>
      </CardContent>
    </Card>
  );
}

export function OpenSpaceChart() {
  return (
    <ReservationChartPlaceholder
      title="Open Space"
      description="Reservations cette semaine"
    />
  );
}

export function MeetingRoomChart() {
  return (
    <ReservationChartPlaceholder
      title="Salles de reunion"
      description="Reservations cette semaine"
    />
  );
}
