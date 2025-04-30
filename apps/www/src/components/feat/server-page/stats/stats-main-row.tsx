"use client";
import { Separator } from "@/components/ui/separator";
import type { ServerResponse } from "@/lib/types/mh-server";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { convert } from "../util";
import { Material } from "@/components/ui/material";
import { Spinner } from "@/components/ui/spinner";
import { Placeholder } from "@/components/ui/placeholder";
import { CircleSlash } from "lucide-react";

export function StatisticsMainRow({
	server,
	mhsfData,
}: {
	server: ServerResponse;
	mhsfData: ReturnType<typeof useMHSFServer>;
}) {
	const [statisticType, setStatisticType] = useQueryState("st", {
		defaultValue: "playerCount",
	});

	return (
		<Material
			className="relative h-[250px] max-lg:mt-3"
			padding="none"
		>
			<div className="p-4">
				<span className="flex gap-4 mb-2">
					<strong className="text-lg max-lg:hidden">Statistics</strong>
					<button
						type="button"
						className={cn(
							"text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition-all duration-75 disabled:opacity-50 disabled:pointer-events-none",
							"rounded-xl px-2 flex items-center gap-2",
							statisticType === "playerCount" &&
								"bg-slate-100 dark:bg-zinc-700/30 font-medium",
						)}
						onClick={() => setStatisticType("playerCount")}
					>
						Player Count
						<Badge className="px-1">
							<code>{convert(server.joins)}</code>
						</Badge>
					</button>
					<button
						type="button"
						className={cn(
							"text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition-all duration-75 disabled:opacity-50 disabled:pointer-events-none",
							"rounded-xl px-2 flex items-center gap-2",
							statisticType === "favorites" &&
								"bg-slate-100 dark:bg-zinc-700/30 font-medium",
						)}
						onClick={() => setStatisticType("favorites")}
					>
						Favorites
						<Badge className="px-1">
							<code>
								{convert(
									mhsfData.server?.favoriteData.favoriteNumber as number,
								)}
							</code>
						</Badge>
					</button>
				</span>
				<Separator />
			</div>
			<div className="mt-2 max-lg:mt-9">
				{!mhsfData.loading ? (
					<>
						{(statisticType === "playerCount"
							? mhsfData.server?.playerData.historically
							: mhsfData.server?.favoriteData.favoriteHistoricalData
						)?.length !== 0 ? (
							<StatisticsChart
								data={
									statisticType === "playerCount"
										? mhsfData.server?.playerData.historically
										: mhsfData.server?.favoriteData.favoriteHistoricalData
								}
								mainDataPoint={statisticType}
							/>
						) : (
							<span className="w-full h-full items-center justify-center flex">
								<Placeholder
									icon={<CircleSlash />}
									title="There is no data to be collected"
									description="This server probably never had any data collected in your choosen timespan."
								/>
							</span>
						)}
					</>
				) : (
					<Spinner />
				)}
			</div>
		</Material>
	);
}

const chartConfig = {
	playerCount: {
		label: "Joins",
		color: "hsl(var(--chart-1))",
	},
	favorites: {
		label: "Favorites",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export function StatisticsChart({
	data,
	mainDataPoint,
}: {
	data: any;
	mainDataPoint: string;
}) {
	console.log(data);
	return (
		<ChartContainer config={chartConfig} className="max-h-[202px] min-w-full">
			<AreaChart
				accessibilityLayer
				data={data.slice(data.length - 30, data.length)}
				margin={{
					top: 30,
				}}
				className="rounded-b-xl"
			>
				<CartesianGrid vertical={false} horizontal={false} />
				<XAxis dataKey="date" tickLine={false} axisLine={false} tick={false} />
				<ChartTooltip
					content={
						<ChartTooltipContent
							className="w-[150px]"
							nameKey={mainDataPoint}
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
				<defs>
					<linearGradient
						id={`fill${mainDataPoint}`}
						x1="0"
						y1="0"
						x2="0"
						y2="1"
					>
						<stop
							offset="25%"
							stopColor={`var(--color-${mainDataPoint})`}
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor={`var(--color-${mainDataPoint})`}
							stopOpacity={0.1}
						/>
					</linearGradient>
				</defs>
				<Area
					dataKey={mainDataPoint}
					type="natural"
					fill={`url(#fill${mainDataPoint})`}
					fillOpacity={0.4}
					stroke={`var(--color-${mainDataPoint})`}
					stackId="a"
				/>
			</AreaChart>
		</ChartContainer>
	);
}
