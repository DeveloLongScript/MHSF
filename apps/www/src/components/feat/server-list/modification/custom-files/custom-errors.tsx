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

import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { compressToEncodedURIComponent } from "lz-string";
import { AlertOctagon, ExternalLink } from "lucide-react";
import type { languages, Uri } from "monaco-editor";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/components/util/link";
import { type RefObject, useEffect, useState } from "react";
import type { MonacoRefType } from "@/app/(sl-modification-frame)/servers/embedded/sl-modification-frame/file/[filename]/page";

export type SyntaxErrorInterface = languages.typescript.Diagnostic[] | null;

export const validateCode = (monacoRef: RefObject<MonacoRefType | null>, filename: string) => {
	return new Promise<SyntaxErrorInterface>((re, rj) => {
		if (!monacoRef.current) return;

		monacoRef.current.languages.typescript
			.getTypeScriptWorker()
			.then((worker) => {
				worker(
					monacoRef.current?.Uri.parse(`file:///${filename}.ts`) as Uri,
				).then((client) => {
					client
						.getSemanticDiagnostics(
							(
								monacoRef.current?.Uri.parse(`file:///${filename}.ts`) as Uri
							).toString(),
						)
						.then((diags) => {
							re(diags);
						});
				});
			});
	})
	
};

export function CustomErrors({
	syntaxErrors
}: {
	syntaxErrors: SyntaxErrorInterface;
}) {


	if (syntaxErrors !== null && syntaxErrors !== undefined)
		return (
			<Drawer direction="right">
				<DrawerTrigger>
					<Button
						variant="danger-subtle"
						size="square-md"
						className="flex items-center justify-center"
					>
						<AlertOctagon />
					</Button>
				</DrawerTrigger>
				<DrawerContent className="p-4 min-w-[400px] overflow-x-hidden max-h-screen overflow-y-auto">
					<DrawerTitle>Type Errors</DrawerTitle>
					<div className="p-2">
						{syntaxErrors.map((c, i) => (
							<Alert
								variant={
									c.category === 1
										? "error"
										: c.category === 0
											? "warning"
											: "info"
								}
								/* biome-ignore lint: No. */
								key={i}
								className="gap-1 my-2"
							>
								{c.messageText.toString()}{" "}
								<DropdownMenu>
									<DropdownMenuTrigger>
										<small className="flex items-center gap-1 cursor-pointer">
											(TS{typeof c !== "string" && c.code})
											<ExternalLink size={16} />
										</small>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<Link
											noextraicons
											target="_blank"
											href={`https://typescript.tv/errors/#ts${c.code}`}
										>
											<DropdownMenuItem>typescript.tv</DropdownMenuItem>
										</Link>
										<Link
											noextraicons
											target="_blank"
											href={`https://ts-error-translator.vercel.app/?error=${compressToEncodedURIComponent(c.messageText.toString())}`}
										>
											<DropdownMenuItem>ts-error-translator</DropdownMenuItem>
										</Link>
									</DropdownMenuContent>
								</DropdownMenu>
							</Alert>
						))}
					</div>
				</DrawerContent>
			</Drawer>
		);

	return <></>;
}
