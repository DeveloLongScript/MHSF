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

import { listenerCtx } from "@milkdown/kit/plugin/listener";
import { Crepe } from "@milkdown/crepe";
import { useEditor, type EditorInfoCtx, Milkdown } from "@milkdown/react";

import "@milkdown/crepe/theme/common/style.css";
import { createContext } from "react";
import { Spinner } from "@/components/ui/spinner";
import { ServerDescriptionLightProvider } from "./server-light-provider";
import { useTheme } from "@/lib/hooks/use-theme";
import { ServerDescriptionDarkProvider } from "./server-dark-provider";

export function ServerEditorDescription({
	defaultMarkdown,
	onUpdate,
}: { defaultMarkdown: string; onUpdate?: (update: string) => void }) {
	const { resolvedTheme } = useTheme();
	const { loading } = useEditor((root) => {
		const crepe = new Crepe({
			root,
			defaultValue: defaultMarkdown,
		});
		crepe.editor.config(async (ctx) => {
			ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
				if (onUpdate) onUpdate(markdown);
			});
		});
		return crepe;
	}, []);

	return (
		<div className="h-[500px] max-h-[500px]">
			{loading && (
				<div>
					<span className="flex items-center justify-center w-full">
						<Spinner />
					</span>
					<span className="flex items-center justify-center w-full mt-2">
						Loading Milkdown
					</span>
				</div>
			)}
			{resolvedTheme === "dark" ? (
				<ServerDescriptionLightProvider>
					<Milkdown />
				</ServerDescriptionLightProvider>
			) : (
				<ServerDescriptionDarkProvider>
					<Milkdown />
				</ServerDescriptionDarkProvider>
			)}
		</div>
	);
}

const editorInfoContext = createContext<EditorInfoCtx>({} as EditorInfoCtx);
