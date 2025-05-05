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

import { Material } from "@/components/ui/material";
import { Placeholder } from "@/components/ui/placeholder";
import { Separator } from "@/components/ui/separator";
import { formalNames } from "@/config/achievements";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import type { Achievement } from "@/lib/types/achievement";
import type { ServerResponse } from "@/lib/types/mh-server";
import { X } from "lucide-react";

export function AchievementsView({
	server,
	mhsfData,
}: { server: ServerResponse; mhsfData: ReturnType<typeof useMHSFServer> }) {
	return (
		<Material className="p-4 relative h-[250px] max-lg:mt-3">
			<span className="mb-2">
				<strong className="text-lg">Achievements</strong>

				<Separator className="my-2" />
			</span>
			<div className="p-2 max-h-[170px] overflow-auto">
				{mhsfData.server?.achievements.currently.filter(
					(value, index, array) => listify(array).indexOf(value.type) === index,
				).length === 0 && (
					<Placeholder
						icon={<X />}
						title="We couldn't find any achievements"
						description="Maybe shake the box harder?"
                        className="mt-4"
					/>
				)}
				{mhsfData.server?.achievements.currently
					.filter(
						(value, index, array) =>
							listify(array).indexOf(value.type) === index,
					)
					.map((c, i) => {
						const Icon = formalNames[c.type].icon;

						return (
							<div className="mb-2" key={i}>
								<span
									className="flex items-center"
									style={{ color: formalNames[c.type].color }}
								>
									<Icon size={16} className="mr-2" />
									<span
										dangerouslySetInnerHTML={{
											__html: formalNames[c.type].title,
										}}
									/>
								</span>
								<p>{formalNames[c.type].description}</p>
								<span className="text-sm text-muted-foreground">
									Achieved on {new Date(c.date).getMonth()}/
									{new Date(c.date).getDate()}/{new Date(c.date).getFullYear()}{" "}
									<span className="text-muted-foreground/70">
										{new Date(c.date).toLocaleTimeString()}
									</span>
								</span>
							</div>
						);
					})}
			</div>
		</Material>
	);
}
const listify = (list: Achievement[]) => {
	const newL: Array<string> = [];

	list.forEach((c) => newL.push(c.type));

	return newL;
};
