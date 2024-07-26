"use client";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { useEffectOnce } from "@/lib/useEffectOnce";

const chartConfig = {
  player_count: {
    label: "Player Count ",
    color: "hsl(var(--chart-1))",
  },
  favorites: {
    label: "Favorites",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartComponent({
  chart,
  server,
}: {
  chart: string;
  server: string;
}) {
  const [data, setData] = useState([]);

  useEffectOnce(() => {
    fetch("/api/history/getShortTermData", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scopes: ["player_count", "favorites", "time"],
        server: server,
      }),
      method: "POST",
    }).then((c) =>
      c.json().then((b) => {
        setData(b.data.slice(-30));
      })
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {chart == "player_count" ? "Joins" : "Favorites"} for {server}
        </CardTitle>
        <CardDescription>Information from the last day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("en-US", {
                  timeStyle: "short",
                });
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <YAxis
              dataKey="player_count"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />

            <Line dataKey={chart} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
