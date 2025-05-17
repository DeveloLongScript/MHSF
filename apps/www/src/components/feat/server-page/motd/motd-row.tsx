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

import { Separator } from "@/components/ui/separator";
import type { ServerResponse } from "@/lib/types/mh-server";
import { MOTDRenderer } from "./motd-renderer";
import useClipboard from "@/lib/useClipboard";
import { miniMessage } from "minimessage-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Material } from "@/components/ui/material";
import { useState } from "react";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import Markdown from "react-markdown";

import type { ReactNode } from "react";
import ShikiHighlighter, {
	type Element,
	isInlineCode,
	rehypeInlineCodeProperty,
} from "react-shiki";

export function MOTDRow({
	server,
	mhsfData,
}: { server: ServerResponse; mhsfData: ReturnType<typeof useMHSFServer> }) {
	const clipboard = useClipboard();
	const [tab, setTab] = useState(
		mhsfData.server?.customizationData.description !== undefined
			? "description"
			: "motd",
	);

	return (
		<Material className="p-4 relative h-[250px]">
			<span className="flex gap-4 justify-between items-center">
				<span className="flex gap-4 items-center">
					<strong className="text-lg max-lg:hidden">
						{tab === "motd" ? "MOTD" : "Description"}
					</strong>
					<button
						type="button"
						className={cn(
							"text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition-all duration-75 disabled:opacity-50 disabled:pointer-events-none",
							"rounded-xl px-2 flex items-center gap-2",
							tab === "motd" && "bg-slate-100 dark:bg-zinc-700/30 font-medium",
						)}
						onClick={() => setTab("motd")}
					>
						MOTD
					</button>
					{mhsfData.server?.customizationData.description !== undefined && (
						<button
							type="button"
							className={cn(
								"text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition-all duration-75 disabled:opacity-50 disabled:pointer-events-none",
								"rounded-xl px-2 flex items-center gap-2",
								tab === "description" &&
									"bg-slate-100 dark:bg-zinc-700/30 font-medium",
							)}
							onClick={() => setTab("description")}
						>
							Description
						</button>
					)}
				</span>
			</span>
			<Separator className="my-2" />
			{tab === "motd" && (
				<>
					<MOTDRenderer
						className={cn("mt-2 break-all overflow-y-auto max-h-[150px]")}
						minecraftFont
					>
						{server.motd}
					</MOTDRenderer>
					<br />
					<small className="absolute bottom-[10px]">
						{server.motd.length} characters,{" "}
						<button
							className="cursor-pointer underline"
							type="button"
							onClick={() => {
								clipboard.writeText(
									miniMessage().toHTML(miniMessage().deserialize(server.motd)),
								);
								toast.success("Copied to clipboard.");
							}}
						>
							click to copy HTML
						</button>
					</small>
				</>
			)}
			{tab === "description" && (
				<div className="prose mt-2 break-words overflow-y-auto max-h-[175px] min-w-full dark:prose-invert">
					<Markdown
						components={{
							code: CodeHighlight,
						}}
					>
						{mhsfData.server?.customizationData.description}
					</Markdown>
				</div>
			)}
		</Material>
	);
}

interface CodeHighlightProps {
	className?: string | undefined;
	children?: ReactNode | undefined;
	node?: Element | undefined;
}

export const CodeHighlight = ({
	className,
	children,
	node,
	...props
}: CodeHighlightProps): ReactNode => {
	const match = className?.match(/language-(\w+)/);
	const language = match ? match[1] : undefined;

	return (
		<ShikiHighlighter language={language?.toLocaleLowerCase()} theme="poimandres" {...props}>
			{String(children)}
		</ShikiHighlighter>
	);
};
