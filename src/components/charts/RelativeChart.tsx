/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
} from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { getRelativeServerData } from "@/lib/api";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";

export function RelativeChart({ server }: { server: string }) {
  const [chartData, setChartData] = useState<
    Array<{ relativePercentage: number; date: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRelativeServerData(server).then((d) => {
      const newv: Array<{ relativePercentage: number; date: string }> = [];

      d.forEach((c) =>
        newv.push({
          relativePercentage: c.relativePrecentage * 100,
          date: c.date,
        })
      );
      setChartData(newv);
      setLoading(false);
    });
  }, [server]);

  if (loading)
    return (
      <>
        <Skeleton className="w-full h-[437px]" />
      </>
    );

  return (
    <Card>
      <CardHeader className="w-full relative">
        <CardTitle>Relative percentage of {server}</CardTitle>
        <CardDescription className="flex items-center">
          Shows the last 30 entries.{" "}
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-4 ml-2" />
            </TooltipTrigger>
            <TooltipContent>
              This is the percentage of players on your server <br />
              compared to the entire Minehut network. <br />
              <code>Server players / Minehut players</code>
            </TooltipContent>
          </Tooltip>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            relativePercentage: {
              label: "Relative percentage",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[250px] w-full aspect-auto"
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
              tickFormatter={(value) =>
                `${new Date(value).toLocaleTimeString("en-US", {
                  timeStyle: "short",
                })}`
              }
            />
            <YAxis
              dataKey="relativePercentage"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="relativePercentage"
                  indicator="line"
                  labelFormatter={(value) => {
                    return `${new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })} ${new Date(value).toLocaleTimeString("en-US", {
                      timeStyle: "short",
                    })}`;
                  }}
                />
              }
            />
            <Line
              dataKey="relativePercentage"
              type="natural"
              stroke="var(--color-relativePercentage)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
