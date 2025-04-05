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

import { transpileTypeScript } from "@/app/(sl-modification-frame)/servers/embedded/sl-modification-frame/file/[filename]/page";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/try-catch";
import { toast } from "sonner";
import type { SyntaxErrorInterface } from "./custom-errors";

export function CustomLint({
	successfullyLinted,
	setSuccessfullyLinted,
	value,
	syntaxErrors,
}: {
	successfullyLinted: boolean;
	setSuccessfullyLinted: (change: boolean) => void;
	value: string;
	syntaxErrors: SyntaxErrorInterface;
}) {
	const lintFile = async () => {
		toast.info("Transpiling TypeScript...");
		const { error, data: transpiledCode } = await tryCatch(
			(async () => transpileTypeScript(value))(),
		);
		if (error) {
			toast.error(`Failed to transpile TypeScript! Error: ${error.message}`);
			return;
		}
		const startTime = Date.now();
		if (transpiledCode === null) {
			toast.error("Cannot continue.");
			return;
		}
		toast.info("Generating function...");
		const functionBody = transpiledCode.match(
			/function\s+filter\s*\([^)]*\)\s*\{([\s\S]*)\}/,
		)?.[1];
		const { error: filterErr, data: filterFunc } = await tryCatch(
			(async () => new Function("data", functionBody as string))(),
		);
		if (filterErr) {
			toast.error(`Failed to generate function! Error: ${filterErr.message}`);
			return;
		}
		if (typeof filterFunc === "function") {
			toast.success(`Linted in ${Date.now() - startTime}ms`);
			setSuccessfullyLinted(true);
		} else {
			toast.error("Code doesn't have a 'filter' function. Cannot be tested.");
			toast.error(typeof filterFunc);
		}
	};

	return (
		<Button
			onClick={lintFile}
			disabled={syntaxErrors === null || syntaxErrors.length !== 0}
			variant={successfullyLinted ? "success-subtle" : "secondary"}
		>
			Lint
		</Button>
	);
}
