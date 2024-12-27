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

import { getAchievements } from "@/lib/api";
import type { Achievement } from "@/lib/types/achievement";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import A from "../misc/Link";
import { formalNames } from "@/config/achievements";
import NoItems from "../misc/NoItems";

export default function AchievementList({ server }: { server: string }) {
	const [achievements, setAchievements] = useState<
		Array<WithInterval<Achievement>>
	>([]);
	const [loading, setLoading] = useState(true);

	useEffectOnce(() => {
		setAchievements(() => []);
		getAchievements(server).then((v) => {
			for (const a of v)
				a.achievements.forEach((item, interval) =>
					setAchievements((prev) => [...prev, { interval, ...item }]),
				);

			setLoading(false);
		});
	});

	if (loading)
		return (
			<div>
				<Skeleton className="w-full h-[112px] my-4" />
				<Skeleton className="w-full h-[112px] my-4" />
				<Skeleton className="w-full h-[112px] my-4" />
			</div>
		);

	return (
		<div>
			<span>
				Achievements are earned automatically when the server is online. See{" "}
				<A alt="Achievement collection">Docs:Advanced/Achievements</A>
			</span>
			{achievements.length === 0 && <NoItems />}
			{achievements
				.filter(
					(value, index) => listify(achievements).indexOf(value.type) === index,
				)
				.map((a) => {
					const Icon = formalNames[a.type].icon;
					return (
						<div key={`${a.date}--${a.interval}`}>
							<Card className="my-4">
								<CardContent className="pt-4">
									<span
										className="flex items-center"
										style={{ color: formalNames[a.type].color }}
									>
										<Icon size={16} className="mr-2" />
										<span
											dangerouslySetInnerHTML={{
												__html: formalNames[a.type].title,
											}}
										/>
									</span>
									<p>{formalNames[a.type].description}</p>
									<span className="text-sm text-muted-foreground">
										Achieved on {new Date(a.date).getMonth()}/
										{new Date(a.date).getDate()}/
										{new Date(a.date).getFullYear()}{" "}
										<span className="text-muted-foreground/70">
											{new Date(a.date).toLocaleTimeString()}
										</span>
									</span>
								</CardContent>
							</Card>
						</div>
					);
				})}
		</div>
	);
}

type WithInterval<K> = K & {
	interval: number;
};

const listify = (list: WithInterval<Achievement>[]) => {
	const newL: Array<string> = [];

	list.forEach((c) => newL.push(c.type));

	return newL;
};
