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
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CalendarIcon } from "lucide-react";
import { getReservationsThisWeek } from "../admin.action";

const chartConfig = {
  reservations: {
    label: "Reservations",
    color: "oklch(0.65 0.2 160)",
  },
} satisfies ChartConfig;

function ReservationChart({
  title,
  description,
  spaceType,
}: {
  title: string;
  description: string;
  spaceType: "open_space" | "meeting_room";
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reservations-week", spaceType],
    queryFn: () => getReservationsThisWeek(spaceType),
  });

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
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={data} accessibilityLayer>
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
        )}
      </CardContent>
    </Card>
  );
}

export function OpenSpaceChart() {
  return (
    <ReservationChart
      title="Open Space"
      description="Reservations cette semaine"
      spaceType="open_space"
    />
  );
}

export function MeetingRoomChart() {
  return (
    <ReservationChart
      title="Salles de reunion"
      description="Reservations cette semaine"
      spaceType="meeting_room"
    />
  );
}
