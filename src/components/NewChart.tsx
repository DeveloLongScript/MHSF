"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { ServerResponse } from "@/lib/types/mh-server";
import { getCommunityServerFavorites, getShortTermData } from "@/lib/api";
import { Skeleton } from "./ui/skeleton";
import FadeIn from "react-fade-in/lib/FadeIn";

const chartConfig = {
  player_count: {
    label: "Joins",
    color: "hsl(var(--chart-1))",
  },
  favorites: {
    label: "Favorites",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function NewChart({ server }: { server: string }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("player_count");

  const [chartData, setChartData] = React.useState<any>([]);
  const [joins, setJoins] = React.useState<any>(0);
  const [loading, setLoading] = React.useState(true);
  const [favorites, setFavorites] = React.useState<any>(0);

  const allNums = { player_count: joins, favorites };
  useEffectOnce(() => {
    getShortTermData(server, ["player_count", "favorites", "date"]).then(
      (c) => {
        setChartData(c);
        getCommunityServerFavorites(server).then((b) => setFavorites(b));
        fetch("https://api.minehut.com/server/" + server + "?byName=true").then(
          (k) => {
            k.json().then((p: { server: ServerResponse }) => {
              setJoins(p.server.joins);
            });
          }
        );
        setLoading(false);
      }
    );
  });

  if (loading)
    return (
      <>
        <Skeleton className="w-full h-[437px]" />
      </>
    );

  return (
    <FadeIn>
      <Card className="w-full">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>
              {chartConfig[activeChart].label} Chart for {server}
            </CardTitle>
            <CardDescription>Showing the past 30 entries.</CardDescription>
          </div>
          <div className="flex">
            {["player_count", "favorites"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {convert(allNums[chart])}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleTimeString("en-US", {
                    timeStyle: "short",
                  });
                }}
              />
              <YAxis
                dataKey={activeChart}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  return (
                    value +
                    (activeChart == "player_count"
                      ? ` plyr${value != 1 ? "s" : ""}.`
                      : ` ${value == 1 ? "favorite" : "favrts."}`)
                  );
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey={activeChart}
                    indicator="line"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleTimeString("en-US", {
                        timeStyle: "short",
                      });
                    }}
                  />
                }
                cursor={false}
                defaultIndex={1}
              />
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={`var(--color-${activeChart})`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

function convert(value: number) {
  var result: string = value.toString();
  if (value >= 1000000) {
    result = Math.floor(value / 1000000) + "m";
  } else if (value >= 1000) {
    result = Math.floor(value / 1000) + "k";
  }
  return result;
}
