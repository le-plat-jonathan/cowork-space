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
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUpIcon } from "lucide-react";

const chartConfig = {
  visitors: {
    label: "Visiteurs",
    color: "oklch(0.65 0.2 250)",
  },
} satisfies ChartConfig;

const emptyData = [
  { day: "Lun", visitors: 0 },
  { day: "Mar", visitors: 0 },
  { day: "Mer", visitors: 0 },
  { day: "Jeu", visitors: 0 },
  { day: "Ven", visitors: 0 },
  { day: "Sam", visitors: 0 },
  { day: "Dim", visitors: 0 },
];

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Frequentation</CardTitle>
          <CardDescription>Visiteurs cette semaine</CardDescription>
        </div>
        <TrendingUpIcon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={emptyData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Aucune donnee de frequentation disponible
        </p>
      </CardContent>
    </Card>
  );
}
