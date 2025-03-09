/*
 * MHSF, Minehut Server List
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
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

"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const chartData = [
  { date: "2024-04-01", player_count: 91 },
  { date: "2024-04-02", player_count: 106 },
  { date: "2024-04-03", player_count: 104 },
  { date: "2024-04-04", player_count: 111 },
  { date: "2024-04-05", player_count: 113 },
  { date: "2024-04-06", player_count: 114 },
  { date: "2024-04-07", player_count: 108 },
  { date: "2024-04-08", player_count: 89 },
  { date: "2024-04-09", player_count: 96 },
  { date: "2024-04-10", player_count: 123 },
  { date: "2024-04-11", player_count: 120 },
  { date: "2024-04-12", player_count: 140 },
  { date: "2024-04-13", player_count: 128 },
  { date: "2024-04-14", player_count: 130 },
  { date: "2024-04-15", player_count: 114 },
  { date: "2024-04-16", player_count: 98 },
  { date: "2024-04-17", player_count: 102 },
  { date: "2024-04-18", player_count: 103 },
  { date: "2024-04-19", player_count: 102 },
  { date: "2024-04-20", player_count: 112},
  { date: "2024-04-21", player_count: 117 },
  { date: "2024-04-22", player_count: 119 },
  { date: "2024-04-23", player_count: 129 },
  { date: "2024-04-24", player_count: 121 },
  { date: "2024-04-25", player_count: 126 },
  { date: "2024-04-26", player_count: 98},
  { date: "2024-04-27", player_count: 102 },
  { date: "2024-04-28", player_count: 100 },
  { date: "2024-04-29", player_count: 101 },
  { date: "2024-04-30", player_count: 104 },
  { date: "2024-05-01", player_count: 109 },
  { date: "2024-05-02", player_count: 86 },
  { date: "2024-05-03", player_count: 93 },
  { date: "2024-05-04", player_count: 108 },
  { date: "2024-05-05", player_count: 112 },
  { date: "2024-05-06", player_count: 111 },
  { date: "2024-05-07", player_count: 96 },
  { date: "2024-05-08", player_count: 100 },
  { date: "2024-05-09", player_count: 124 },
  { date: "2024-05-10", player_count: 134 },
  { date: "2024-05-11", player_count: 144 },
  { date: "2024-05-12", player_count: 156 },
  { date: "2024-05-13", player_count: 180 },
  { date: "2024-05-14", player_count: 167 },
  { date: "2024-05-15", player_count: 154 },
  { date: "2024-05-16", player_count: 124 },
  { date: "2024-05-17", player_count: 112 },
  { date: "2024-05-18", player_count: 114 },
  { date: "2024-05-19", player_count: 121 },
  { date: "2024-05-20", player_count: 96 },
  { date: "2024-05-21", player_count: 102 },
  { date: "2024-05-22", player_count: 131 },
]

const chartConfig = {
  player_count: {
    label: "Players",
    color: "hsl(var(--chart-1))",
  }
} satisfies ChartConfig

export function ExampleChart() {

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-sm">Player count over 3 months</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillPlayers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-player_count)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-player_count)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="player_count"
              type="natural"
              fill="url(#fillPlayers)"
              stroke="var(--color-player_count)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
