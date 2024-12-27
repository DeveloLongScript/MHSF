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

"use client";
import { cn } from "@/lib/utils";
import { Docs } from "contentlayer/generated";
import { useEffect, useMemo, useState } from "react";

export default function TableOfContent({
	doc,
	toc,
}: {
	doc: Docs;
	toc: { level: number; text: string; slug: string };
}) {
	const itemIds = useMemo(
		() =>
			doc?.toc.flatMap(
				(c: { level: number; text: string; slug: string }) => c.slug,
			),
		[doc],
	);
	const activeHeading = useActiveItem(itemIds);

	return <Tree item={toc} activeItem={activeHeading} />;
}

function useActiveItem(itemIds: string[]) {
	const [activeId, setActiveId] = useState<any>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{ rootMargin: `0% 0% -80% 0%` },
		);

		itemIds?.forEach((id) => {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		});

		return () => {
			itemIds?.forEach((id) => {
				const element = document.getElementById(id);
				if (element) {
					observer.unobserve(element);
				}
			});
		};
	}, [itemIds]);

	return activeId;
}

interface TreeProps {
	item: { level: number; text: string; slug: string };
	activeItem?: string;
}

function Tree({ item, activeItem }: TreeProps) {
	return (
		<>
			<ul className={cn("m-0 list-none", { "pl-4": item.level !== 1 })}>
				<li key={item.text} className={cn("mt-0 pt-2")}>
					<a
						href={"#" + item.slug}
						className={cn(
							"inline-block no-underline transition-colors hover:text-foreground",
							item.slug === `${activeItem}`
								? "font-medium text-foreground"
								: "text-muted-foreground",
						)}
					>
						{item.text}
					</a>
				</li>
			</ul>
		</>
	);
}
