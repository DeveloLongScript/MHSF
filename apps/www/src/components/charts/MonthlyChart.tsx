/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
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
"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

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
import { Skeleton } from "../ui/skeleton";
import { useTrend } from "@/lib/hooks/use-trend";
import { getMonthlyData } from "@/lib/api";

const chartConfig = {
	result: {
		label: "Players",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

export function MonthlyChart({ server }: { server: string }) {
	const [chartData, setChartData] = useState<
		{ month: string; result: number }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const { trend, percentage, success } = useTrend(chartData);

	useEffect(() => {
		getMonthlyData(server).then((c) => {
			setChartData(c);
			setLoading(false);
		});
	}, [server]);

	if (loading) return <Skeleton className="w-full h-[437px]" />;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Average monthly players</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="">
					<BarChart
						accessibilityLayer
						data={chartData}
						layout="vertical"
						margin={{
							left: -20,
						}}
					>
						<CartesianGrid horizontal={false} />
						<XAxis type="number" dataKey="result" hide />
						<YAxis
							dataKey="month"
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar dataKey="result" fill="var(--color-result)" radius={5} activeIndex={chartData.findIndex(
								(c) =>
									c.month ===
									new Date().toLocaleDateString("en-US", { month: "long" }),
							)}
							activeBar={({ ...props }) => {
								return (
									<Rectangle
										{...props}
										fill="hsl(var(--chart-4))"
										stroke={props.payload.fill}
										strokeDasharray={4}
										strokeDashoffset={4}
									/>
								);
							}}>
							<LabelList
								dataKey="result"
								position="insideLeft"
								offset={8}
								className="fill-[--color-label]"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				{success ? (
					<div
						className={
							"flex gap-2 items-center font-medium leading-none " +
							(trend === "up" ? "text-green-400" : "text-red-400")
						}
					>
						Trending {trend} by {percentage}% this month{" "}
						{trend === "up" ? (
							<TrendingUp className="h-4 w-4" />
						) : (
							<TrendingDown className="h-4 w-4" />
						)}
					</div>
				) : (
					<div className={"flex gap-2 items-center font-medium leading-none"}>
						Trending up by 0% this month{" "}
						<span className="text-muted-foreground">(Insufficient data)</span>
					</div>
				)}
				<div className="leading-none text-muted-foreground">
					Showing an average of all data for {server}
				</div>
			</CardFooter>
		</Card>
	);
}
