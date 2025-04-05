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

import type { ClerkCustomActivatedModification } from "@/components/feat/server-list/modification/modification-file-creation-dialog";
import {
	Setting,
	SettingContent,
	SettingDescription,
	SettingMeta,
	SettingTitle,
} from "@/components/feat/settings/setting";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Material } from "@/components/ui/material";
import { Placeholder } from "@/components/ui/placeholder";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/components/util/link";
import { serverModDB } from "@/config/sl-mod-db";
import { useUser } from "@clerk/nextjs";
import {
	ArrowLeft,
	EllipsisVertical,
	FileQuestion,
	Filter,
	SortAsc,
	Trash,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { use } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";

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
	const modIndex = (
		(user?.unsafeMetadata
			.activatedModifications as ClerkCustomActivatedModification[]) ?? []
	).findIndex((c) => c.friendlyName === atob(decodeURIComponent(mod)));

	if (modIndex === -1)
		return (
			<div className="w-full h-full flex justify-center items-center absolute top-[0%]">
				<Link href={backRoute}>
					<ArrowLeft className="absolute left-[10px] top-[10px]" />
				</Link>
				<Placeholder
					title="We couldn't find the file you were looking for."
					icon={<FileQuestion />}
				/>
			</div>
		);

	const modObj = ((user?.unsafeMetadata
		.activatedModifications as ClerkCustomActivatedModification[]) ?? [])[
		modIndex
	];

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
				<div className="flex justify-between items-center">
					<Button className="mt-2">
						{modObj?.active ? "Disable" : "Enable"}
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								variant="secondary"
								className="flex items-center"
								size="sm"
							>
								<EllipsisVertical size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								className="gap-2"
								onClick={async () => {
									const time = Date.now();
									const array =
										(user?.unsafeMetadata
											.activatedModifications as ClerkCustomActivatedModification[]) ??
										[];
									array.splice(modIndex, 1);
									await user?.update({
										unsafeMetadata: {
											...user.unsafeMetadata,
											activatedModifications: array,
										},
									});
									toast.success(`Deleted in ${Date.now() - time}ms`);
								}}
							>
								<Trash size={16} /> Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Separator className="mt-3" />

				<Material className="mt-6 grid gap-3">
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
					<Setting>
						<SettingContent className="flex items-center">
							<SettingMeta>
								<SettingTitle>File name</SettingTitle>
							</SettingMeta>
							<Link
								href={
									`"/servers/embedded/sl-modification-frame/file/${modObj.originalFileName}`
								}
								className="text-blue-600"
							>
								<code className="flex items-center">
									{modObj.originalFileName}.ts
								</code>
							</Link>
						</SettingContent>
					</Setting>
				</Material>
			</span>
		</main>
	);
}
