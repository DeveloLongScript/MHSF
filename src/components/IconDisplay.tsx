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

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

export default function IconDisplay(props: {
	server: any;
	className?: string;
}) {
	return (
		<Tooltip>
			<TooltipTrigger>
				<div>
					<i
						className={
							(props.server.icon != null
								? "icon-minecraft icon-minecraft-" +
									props.server.icon.replaceAll("_", "-").toLowerCase() +
									" "
								: "icon-minecraft icon-minecraft-oak-sign ") + props.className
						}
					/>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<div className="font-mono">
					{props.server.icon != null
						? props.server.icon.toLowerCase()
						: "oak_sign"}
				</div>
				{props.server.icon == null && (
					<div>
						(this is the icon that loads in the lobby, the icon has not been
						picked)
					</div>
				)}
			</TooltipContent>
		</Tooltip>
	);
}

export function IconDisplayClient(props: { server: string }) {
	const [icon, setIcon] = useState("");

	useEffect(() => {
		fetch(
			"https://api.minehut.com/server/" + props.server + "?byName=true",
		).then((b) => b.json().then((c) => setIcon(c.server.icon)));
	}, []);

	return (
		<>
			{icon != "" && (
				<Tooltip>
					<TooltipTrigger>
						<i
							className={
								(icon != null
									? "icon-minecraft icon-minecraft-" +
										icon.replaceAll("_", "-").toLowerCase()
									: "icon-minecraft icon-minecraft-oak-sign") +
								" w-[16px] h-[16px]"
							}
						/>
					</TooltipTrigger>
					<TooltipContent>
						<div className="font-mono">
							{icon != null ? icon.toLowerCase() : "oak_sign"}
						</div>
						{icon == null && (
							<div>
								(this is the icon that loads in the lobby, the icon has not been
								picked)
							</div>
						)}
					</TooltipContent>
				</Tooltip>
			)}
		</>
	);
}
