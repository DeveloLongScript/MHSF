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

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Material } from "@/components/ui/material";
import { Separator } from "@/components/ui/separator";
import { useEmbedGenerator } from "@/lib/hooks/use-embed-generator";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { useTheme } from "@/lib/hooks/use-theme";
import useClipboard from "@/lib/useClipboard";
import { toast } from "sonner";

export function EmbedCreatorRow({ serverName }: { serverName: string }) {
	const embedCreator = useEmbedGenerator(serverName);
	const clipboard = useClipboard();
	const { resolvedTheme } = useTheme();
	const [tab, setTab] = useState<"preview" | "code">("preview");
	const [highlightedHtml, setHighlightedHtml] = useState("");
	const [highlightedJsx, setHighlightedJsx] = useState("");
	const [codeTab, setCodeTab] = useState<"html" | "jsx">("html");

	useEffect(() => {
		const selectedTheme =
			resolvedTheme === "dark" ? "poimandres" : "vitesse-light";
		async function highlightCode() {
			const jsx = await codeToHtml(embedCreator.out.jsxCode ?? "", {
				lang: "jsx",
				theme: selectedTheme,
			});
			const html = await codeToHtml(embedCreator.out.htmlCode ?? "", {
				lang: "html",
				theme: selectedTheme,
			});
			setHighlightedHtml(html);
			setHighlightedJsx(jsx);
		}

		highlightCode();
	});

	return (
		<Material className="p-4 relative h-[250px] max-lg:mt-3">
			<span className="mb-2">
				<span className="flex items-center justify-between">
					<span className="flex gap-4 items-center">
						<strong className="text-lg">Embed Creator</strong>
						<button
							type="button"
							className={cn(
								"text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition-all duration-75 disabled:opacity-50 disabled:pointer-events-none",
								"rounded-xl px-2 flex items-center gap-2",
								tab === "preview" &&
									"bg-slate-100 dark:bg-zinc-700/30 font-medium",
							)}
							onClick={() => setTab("preview")}
						>
							Preview
						</button>
						<button
							type="button"
							className={cn(
								"text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition-all duration-75 disabled:opacity-50 disabled:pointer-events-none",
								"rounded-xl px-2 flex items-center gap-2",
								tab === "code" &&
									"bg-slate-100 dark:bg-zinc-700/30 font-medium",
							)}
							onClick={() => setTab("code")}
						>
							Code
						</button>
					</span>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								className="flex items-center"
								size="square-md"
								variant="secondary"
							>
								<EllipsisVertical size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuSeparator>General</DropdownMenuSeparator>
							<DropdownMenuCheckboxItem
								checked={embedCreator.in.staticMode}
								onCheckedChange={embedCreator.in.setStatic}
							>
								Static embed
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={embedCreator.in.removeMinehutBranding}
								onCheckedChange={embedCreator.in.setRMHB}
							>
								Remove Minehut branding
							</DropdownMenuCheckboxItem>
							<DropdownMenuSeparator>Theme</DropdownMenuSeparator>
							<DropdownMenuRadioGroup
								value={embedCreator.in.theme}
								onValueChange={(c) =>
									embedCreator.in.setTheme(c as "light" | "dark")
								}
							>
								<DropdownMenuRadioItem value="light">
									Light Mode
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="dark">
									Dark Mode
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
							<DropdownMenuSeparator>Copy</DropdownMenuSeparator>
							{tab === "code" ? (
								<DropdownMenuItem
									onClick={() => {
										clipboard.writeText(
											embedCreator.out[
												codeTab === "html" ? "htmlCode" : "jsxCode"
											] as string,
										);
                                        toast.success(`Copied ${codeTab.toLocaleUpperCase()} code!`)
									}}
								>
									Copy code
								</DropdownMenuItem>
							) : (
								<>
									<DropdownMenuItem
										onClick={() => {
											clipboard.writeText(embedCreator.out.jsxCode as string);
											toast.success("Copied!");
										}}
									>
										Copy JSX
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											clipboard.writeText(embedCreator.out.htmlCode as string);
											toast.success("Copied!");
										}}
									>
										Copy HTML
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</span>

				<Separator className="my-2" />
			</span>
			{tab === "preview" && (
				<iframe
					src={embedCreator.out.finalURL}
					className="max-md:w-full w-[390px]"
					height={145}
					style={{ borderRadius: "0.25rem" }}
					allow="clipboard-write"
					frameBorder={0}
					sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
				/>
			)}
			{tab === "code" && (
				<div className="max-h-[180px] overflow-auto">
					<div className="dark:bg-[#1b1e28] w-full h-[32px] pt-2 px-2 rounded-t flex items-center gap-2">
						<button
							type="button"
							className={cn(
								"text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition-all duration-75 disabled:opacity-50 disabled:pointer-events-none",
								"rounded-xl px-2 flex items-center gap-2",
								codeTab === "html" &&
									"bg-slate-100 dark:bg-zinc-700/30 font-medium",
							)}
							onClick={() => setCodeTab("html")}
						>
							HTML
						</button>
						<button
							type="button"
							className={cn(
								"text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition-all duration-75 disabled:opacity-50 disabled:pointer-events-none",
								"rounded-xl px-2 flex items-center gap-2",
								codeTab === "jsx" &&
									"bg-slate-100 dark:bg-zinc-700/30 font-medium",
							)}
							onClick={() => setCodeTab("jsx")}
						>
							JSX
						</button>
					</div>
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Its shiki man give me a break :sob: */}
					<div
						dangerouslySetInnerHTML={{
							__html: codeTab === "html" ? highlightedHtml : highlightedJsx,
						}}
						className="rounded-b"
					/>
				</div>
			)}
		</Material>
	);
}
