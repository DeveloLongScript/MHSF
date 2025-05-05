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

import { ModificationAction } from "@/components/feat/server-list/modification/modification-action";
import { ModificationCustomModificationRow } from "@/components/feat/server-list/modification/modification-custom-modification-row";
import { ClerkCustomActivatedModification } from "@/components/feat/server-list/modification/modification-file-creation-dialog";
import { Material } from "@/components/ui/material";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/components/util/link";
import { serverModDB } from "@/config/sl-mod-db";
import { useRouter } from "@/lib/useRouter";
import { cn } from "@/lib/utils";
import { SignedIn, useUser } from "@clerk/nextjs";
import { ArrowLeft, Binary } from "lucide-react";
import { use } from "react";
import Markdown from "react-markdown";

export default async function ServerListCategoryFrame({
	params,
}: {
	params: Promise<{ category: string }>;
}) {
	const { category } = await params;
	const categoryObj = serverModDB.find(
		(c) => c.displayTitle === atob(decodeURIComponent(category)),
	);
	return (
		<main className=" p-4">
			<h1 className="text-xl font-bold w-full flex items-center gap-2">
				<Link href="/servers/embedded/sl-modification-frame">
					<ArrowLeft size={20} />
				</Link>
				{categoryObj?.displayTitle}
			</h1>
			<Markdown className="text-wrap pt-2">{categoryObj?.description}</Markdown>

			<Material className="mt-10 p-4 grid lg:grid-cols-3 grid-cols-6 gap-2">
				{categoryObj?.entries.map((m) => (
					<Link
						key={m.name}
						href={`/servers/embedded/sl-modification-frame/category/${category}/modification/${btoa(m.name)}?b=${encodeURIComponent(`/servers/embedded/sl-modification-frame/category/${category}`)}`}
					>
						<Material
							className="p-2 hover:drop-shadow-card-hover cursor-pointer"
							elevation="high"
						>
							<div
								className={cn(
									"w-full h-[40px] mb-2 rounded-lg items-center text-center justify-center",
								)}
								style={{ backgroundColor: m.color }}
							>
								<m.icon
									className="relative top-[calc(50%-12px)] items-center w-full text-center justify-center"
									color={invertHex(m.color)}
								/>
							</div>
							<span className="text-sm text-center w-full flex items-center justify-center">
								{m.name}
							</span>
						</Material>
					</Link>
				))}
				<SignedIn>
					{categoryObj?.__custom && (
						<ModificationCustomModificationRow category={category} />
					)}
				</SignedIn>
			</Material>
		</main>
	);
}

export function invertHex(hex: string) {
	if (hex.indexOf("#") === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error("Invalid HEX color.");
	}
	// invert color components
	const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
		g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
		b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
	// pad each with zeros and return
	return "#" + padZero(r) + padZero(g) + padZero(b);
}
function padZero(str: string, len: number) {
	len = len || 2;
	const zeros = new Array(len).join("0");
	return (zeros + str).slice(-len);
}
