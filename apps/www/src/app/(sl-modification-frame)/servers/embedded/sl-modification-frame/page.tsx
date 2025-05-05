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

import { Material } from "@/components/ui/material";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/components/util/link";
import { serverModDB } from "@/config/sl-mod-db";
import { ArrowRight, Binary } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/useRouter";
import { SignedIn, useUser } from "@clerk/nextjs";
import { ClerkCustomActivatedModification } from "@/components/feat/server-list/modification/modification-file-creation-dialog";
import { invertHex } from "./category/[category]/page";

export default function ServerListModificationFrame() {
	const router = useRouter();
	const { user } = useUser();

	return (
		<main className=" p-4">
			<h1 className="text-xl font-bold w-full">Filters & Sorting</h1>
			<div className="flex items-center gap-2 my-2">
				<Button size="sm">Active modifications</Button>
				<Link href="/servers/embedded/sl-modification-frame/files">
					<Button size="sm">Custom files</Button>
				</Link>
				<Button size="sm">Settings</Button>
			</div>
			<span className="text-wrap pt-2">
				Pick out different filters & sorting systems to customize your server
				viewing experience. We frequently add new filters in accordance to new
				features, as well.
			</span>
			<Material className="mt-10 p-4">
				{serverModDB.map(
					(c) =>
						(!c.__custom ||
							(c.__custom &&
								(
									(user?.unsafeMetadata
										.activatedModifications as ClerkCustomActivatedModification[]) ??
									[]
								).length !== 0)) && (
							<div key={c.displayTitle} className="my-4">
								<h2 className="text-lg font-bold pb-3 flex justify-between">
									{c.displayTitle}
									<Link
										href={`/servers/embedded/sl-modification-frame/category/${btoa(c.displayTitle)}`}
										className="flex gap-2 text-sm font-normal items-center"
									>
										<ArrowRight size={16} />
										View more
									</Link>
								</h2>
								<div className="grid grid-cols-6 lg:grid-cols-3 gap-2">
									{c.entries.slice(0, 6).map((m) => (
										<Material
											elevation="high"
											className="p-2 hover:drop-shadow-card-hover cursor-pointer"
											key={m.name}
											onClick={() =>
												router.push(
													`/servers/embedded/sl-modification-frame/category/${btoa(c.displayTitle)}/modification/${btoa(m.name)}`,
												)
											}
										>
											<div
												className="w-full h-[40px] mb-2 rounded-lg items-center text-center justify-center"
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
									))}
									<SignedIn>
										{c.__custom &&
											(
												(user?.unsafeMetadata
													.activatedModifications as ClerkCustomActivatedModification[]) ??
												[]
											).map((m) => (
												<Material
													elevation="high"
													className="p-2 hover:drop-shadow-card-hover cursor-pointer"
													key={m.friendlyName}
													onClick={() =>
														router.push(
															`/servers/embedded/sl-modification-frame/category/${btoa(c.displayTitle)}/modification/custom/${btoa(m.friendlyName)}`,
														)
													}
												>
													<div
														className="w-full h-[40px] mb-2 rounded-lg items-center text-center justify-center"
														style={{ backgroundColor: m.color }}
													>
														<Binary
															className="relative top-[calc(50%-12px)] items-center w-full text-center justify-center"
															color={invertHex(m.color)}
														/>
													</div>
													<span className="text-sm text-center w-full flex items-center justify-center">
														{m.friendlyName}
													</span>
												</Material>
											))}
									</SignedIn>
								</div>
							</div>
						),
				)}
			</Material>
		</main>
	);
}
