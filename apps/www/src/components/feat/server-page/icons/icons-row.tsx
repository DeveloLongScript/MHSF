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
import { Separator } from "@/components/ui/separator";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import type { ServerResponse } from "@/lib/types/mh-server";
import { getIndexFromRarity } from "@/lib/types/server-icon";
import IconDisplay from "../../icons/minecraft-icon-display";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Banknote, Info, X } from "lucide-react";
import { useIcons } from "@/lib/hooks/use-icons";
import { Placeholder } from "@/components/ui/placeholder";

export function IconsRow({
	server,
	mhsfData,
}: { server: ServerResponse; mhsfData: ReturnType<typeof useMHSFServer> }) {
	const { icons } = useIcons();

	return (
		<Material className="p-4 relative h-[250px] max-lg:mt-3">
			<span className="mb-2">
				<div className="flex items-center">
					<strong className="text-lg">Purchased Icons</strong>
					<Tooltip>
						<TooltipTrigger>
							<Info size={16} className="ml-2" />
						</TooltipTrigger>
						<TooltipContent>
							Purchased Icons are icons that are under the server's ownership, <br />
							they may or may not available at that certain moment either.
						</TooltipContent>
					</Tooltip>
				</div>

				<Separator className="my-2" />
			</span>
			<div className="p-2 max-h-[180px] overflow-auto">
                {server?.purchased_icons.length === 0 && 
					<Placeholder
						icon={<X />}
						title="We couldn't find any icons"
						description="Maybe shake the box harder?"
                        className="mt-4"
					/>}
				{server?.purchased_icons.map((icon, i) => (
					<p
						key={i}
						className="pb-4 flex items-center justify-between"
						style={{
							color: getIndexFromRarity(
								icons?.find((c) => c._id === icon)?.rank.toLowerCase(),
							).text,
						}}
					>
						<div className="flex items-center">
							<IconDisplay
								server={{
									icon: icons?.find((c) => c._id === icon)?.icon_name ?? "",
								}}
								className="mr-2"
							/>
							{icons?.find((c) => c._id === icon)?.display_name}
							<Tooltip>
								<TooltipTrigger>
									<Info size={18} className="ml-2" />
								</TooltipTrigger>
								<TooltipContent>
									Just because an item is available, it doesn't directly <br />
									mean that it can be bought immediately, it just means its in the{" "}
									<br />
									pool of icons that are in the weekly rotation.
									<br />
									<br />
									<span className="flex items-center">
										<span className="mr-1">Available currently:</span>
										{icons?.find((c) => c._id === icon)?.available ? "Yes" : "No"}
									</span>
									<span className="flex items-center">
										<span className="mr-1">Disabled currently:</span>
										{icons?.find((c) => c._id === icon)?.disabled ? "Yes" : "No"}
									</span>
									<span className="flex items-center">
										<span className="mr-1">Price:</span>
										<Banknote size={16} className="mr-1" />
										{icons?.find((c) => c._id === icon)?.price} credits
									</span>
								</TooltipContent>
							</Tooltip>
						</div>

						<span
							className="mx-2 p-1 pr-2 rounded italic font-bold"
							style={{
								backgroundColor: getIndexFromRarity(
									icons?.find((c) => c._id === icon)?.rank.toLowerCase(),
								).bg,
							}}
						>
							{icons?.find((c) => c._id === icon)?.rank.toLocaleUpperCase()}
						</span>
					</p>
				))}
			</div>
		</Material>
	);
}
