/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
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

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { getShortTermData } from "@/lib/api";
import { useEffectOnce } from "@/lib/useEffectOnce";
import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
	player_count: {
		label: "Joins",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export function MiniJoinsChart({ server }: { server: string }) {
	const [chartData, setChartData] = React.useState<any>([]);
	const [loading, setLoading] = React.useState(true);

	useEffectOnce(() => {
		getShortTermData(server, ["player_count", "date"]).then((result) => {
			setChartData(result.slice(-20));
			setLoading(false);
		});
	});

	return (
		<div className="max-h-[160px] w-full">
			<ChartContainer config={chartConfig}>
				<LineChart accessibilityLayer data={chartData}>
					<CartesianGrid vertical={false} />
					<YAxis
						dataKey={"player_count"}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value) => {
							return value;
						}}
					/>
					<XAxis
						dataKey="date"
						className="hidden"
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
					<ChartTooltip
						content={
							<ChartTooltipContent
								className="w-[150px]"
								nameKey={"player_count"}
								indicator="line"
								labelFormatter={(value) => {
									return new Date(value).toLocaleTimeString("en-US", {
										timeStyle: "short",
									});
								}}
							/>
						}
					/>
					<Line
						dataKey={"player_count"}
						type="monotone"
						stroke={"var(--color-player_count)"}
						strokeWidth={2}
						dot={false}
					/>
				</LineChart>
			</ChartContainer>
		</div>
	);
}
