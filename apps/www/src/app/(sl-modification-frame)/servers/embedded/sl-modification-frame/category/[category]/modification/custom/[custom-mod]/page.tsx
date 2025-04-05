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

import { ModificationAction } from "@/components/feat/server-list/modification/modification-action";
import { ClerkCustomActivatedModification } from "@/components/feat/server-list/modification/modification-file-creation-dialog";
import {
	Setting,
	SettingContent,
	SettingDescription,
	SettingMeta,
	SettingTitle,
} from "@/components/feat/settings/setting";
import { Button } from "@/components/ui/button";
import { Material } from "@/components/ui/material";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/components/util/link";
import { serverModDB } from "@/config/sl-mod-db";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Filter, SortAsc } from "lucide-react";
import { useQueryState } from "nuqs";
import { use } from "react";
import Markdown from "react-markdown";

export default function ModificationPage({
	params,
}: {
	params: Promise<{ category: string; "custom-mod": string }>;
}) {
	const { category, "custom-mod": mod } = use(params);
	const { user } = useUser();
	const [backRoute] = useQueryState("b", {
		defaultValue: "/servers/embedded/sl-modification-frame",
	});
	console.log(mod);
	const modObj = (
		(user?.unsafeMetadata
			.activatedModifications as ClerkCustomActivatedModification[]) ?? []
	).find((c) => c.friendlyName === atob(decodeURIComponent(mod)));

	if (modObj === undefined)
		return <>We couldn't find the modification you were looking for.</>;

	return (
		<main className="max-w-[800px] p-4">
			<div
				className="h-[150px] w-full rounded-xl p-2"
				style={{ backgroundColor: modObj?.color }}
			>
				<Link href={backRoute}>
					<ArrowLeft />
				</Link>
			</div>

			<span className="p-4">
				<h1 className="text-xl font-bold w-full">{modObj?.friendlyName}</h1>
				<Markdown className="text-wrap pt-2">
					This is a custom modification. Enable it! (or not) It's your own! (are
					you proud?)
				</Markdown>
				<Button className="mt-2">
					{modObj?.active ? "Disable" : "Enable"}
				</Button>

				<Separator className="mt-3" />

				<Material className="mt-6">
					<Setting>
						<SettingContent className="flex items-center">
							<SettingMeta>
								<SettingTitle>Type</SettingTitle>
								<SettingDescription>
									What type of modification is this?
								</SettingDescription>
							</SettingMeta>
							<div className="flex items-center">
								{modObj.testMode === "sort" ? (
									<div className="flex items-center gap-1">
										<SortAsc size={16} />
										Sort
									</div>
								) : (
									<div className="flex items-center gap-1">
										<Filter size={16} /> Filter
									</div>
								)}
							</div>
						</SettingContent>
					</Setting>
				</Material>
			</span>
		</main>
	);
}
