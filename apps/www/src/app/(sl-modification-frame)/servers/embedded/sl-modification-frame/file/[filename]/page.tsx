"use client";

import { use, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { ClerkCustomModification } from "@/components/feat/server-list/modification/modification-file-creation-dialog";
import { Link } from "@/components/util/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Editor from "@monaco-editor/react";
import { toast } from "sonner";
import * as ts from "typescript";
import useClipboard from "@/lib/useClipboard";
import { useTheme } from "@/lib/hooks/use-theme";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { languages } from "monaco-editor";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { tryCatch } from "@/lib/try-catch";
import { Placeholder } from "@/components/ui/placeholder";
import { CustomErrors } from "@/components/feat/server-list/modification/custom-files/custom-errors";
import { CustomLint } from "@/components/feat/server-list/modification/custom-files/custom-lint";
import { CustomTest } from "@/components/feat/server-list/modification/custom-files/custom-test";

export type MonacoRefType = typeof import(
	"monaco-editor/esm/vs/editor/editor.api"
);

const typeDefs = `// Hi :) how'd you get here?
// Here, in return I'll provide you with a random number: ${Math.ceil(Math.random() * 100)}
// I just wanted you to know that people love you
// and people are there for you :)
// Even when things get sad, just think about the bright side (seriously!)

export namespace Minehut {
  /**
   * A Minehut server that is online. You could get this value by using the \`/servers\` endpoint.
   */  
  export interface OnlineServer {
    staticInfo: {
      _id: string;
      serverPlan: string;
      serviceStartDate: number;
      platform: string;
      planMaxPlayers: number;
      planRam: number;
      alwaysOnline: boolean;
      rawPlan: string;
      connectedServers: any[];
    };
    maxPlayers: number;
    name: string;
    motd: string;
    icon: string;
    playerData: {
      playerCount: number;
      timeNoPlayers: number;
    };
    connectable: boolean;
    visibility: boolean;
    allCategories: string[];
    usingCosmetics: boolean;
    author?: string;
    authorRank: string;
  }
}
`;

export const transpileTypeScript = (code: string) => {
	try {
		const result = ts.transpileModule(typeDefs + code, {
			compilerOptions: {
				module: ts.ModuleKind.ESNext,
				target: ts.ScriptTarget.ESNext,
				jsx: ts.JsxEmit.ReactJSX,
				esModuleInterop: true,
			},
		});
		return result.outputText;
	} catch (error) {
		console.error("TypeScript transpilation error:", error);
		toast.error(`TypeScript error: ${error}`);
		return null;
	}
};

export default function CustomFilePage({
	params,
}: {
	params: Promise<{ filename: string }>;
}) {
	const { filename } = use(params);
	const { user } = useUser();
	const monacoRef =
		useRef<typeof import("monaco-editor/esm/vs/editor/editor.api")>(null);
	const { resolvedTheme } = useTheme();
	const [successfullyLinted, setSuccessfullyLinted] = useState(false);
	const [syntaxErrors, setSyntaxErrors] = useState<
		languages.typescript.Diagnostic[] | null
	>(null);
	const file = (
		(user?.unsafeMetadata.customFiles as Array<ClerkCustomModification>) ?? []
	).findIndex((c) => c.name === filename);

	if (file === -1) {
		return (
			<div className="w-full h-full flex justify-center items-center absolute top-[0%]">
				<Link href="/servers/embedded/sl-modification-frame">
					<ArrowLeft className="absolute left-[10px] top-[10px]" />
				</Link>
				<Placeholder
					title="We couldn't find the file you were looking for."
					icon={<FileQuestion />}
				/>
			</div>
		);
	}

	const fileContents = ((user?.unsafeMetadata
		.customFiles as Array<ClerkCustomModification>) ?? [])[file].contents;
	const [value, setValue] = useState(fileContents);
	const clipboard = useClipboard();

	const saveFile = async () => {
		const metadata =
			(user?.unsafeMetadata.customFiles as Array<ClerkCustomModification>) ??
			[];
		const index = (
			(user?.unsafeMetadata.customFiles as Array<ClerkCustomModification>) ?? []
		).findIndex((c) => c.name === filename);

		metadata[index].contents = value;

		await user?.update({
			unsafeMetadata: {
				...user.unsafeMetadata,
				customFiles: metadata,
			},
		});
	};

	const debouncedSave = debounce(async () => {
		const { error } = await tryCatch(saveFile());
		if (error)
			toast.error(
				"Whoa! We encountered an error while auto-saving. Please copy your code locally to ensure you'll keep your code changes.",
			);
	}, 300);

	// biome-ignore lint: L
	useEffect(() => {
		setSuccessfullyLinted(false);
		debouncedSave();
	}, [value]);

	return (
		<main className="max-w-[800px] p-4">
			<div className="w-full justify-between flex items-center gap-2 my-2">
				<strong className="flex items-center gap-1">
					<Link href="/servers/embedded/sl-modification-frame/files">
						<ArrowLeft size={20} />
					</Link>
					{filename}.ts
				</strong>
				<span className="flex items-center gap-2">
					{syntaxErrors !== null && syntaxErrors.length !== 0 && (
						<CustomErrors
							filename={filename}
							value={value}
							monacoRef={monacoRef}
						/>
					)}
					<Tooltip>
						<TooltipTrigger>
							<CustomLint
								successfullyLinted={successfullyLinted}
								setSuccessfullyLinted={setSuccessfullyLinted}
								syntaxErrors={syntaxErrors}
								value={value}
							/>
						</TooltipTrigger>
						<TooltipContent>
							{syntaxErrors !== null && syntaxErrors.length !== 0
								? `You must have no type errors in the editor to lint, you have ${syntaxErrors.length} error(s).`
								: "Check for possible runtime errors."}
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<CustomTest
								value={value}
								successfullyLinted={successfullyLinted}
							/>
						</TooltipTrigger>
						<TooltipContent>
							{successfullyLinted
								? "Open a full server-list instance with your filter activated in test mode."
								: "You must lint before testing."}
						</TooltipContent>
					</Tooltip>
				</span>
			</div>
			<div>
				<Editor
					className={cn("h-[calc(100vh-100px)]")}
					defaultLanguage="typescript"
					value={value}
					theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
					onChange={(newValue) => {
						setValue(newValue || "");
					}}
					onMount={(editor, monaco) => {
						monacoRef.current = monaco;
						// Ensure TypeScript is properly configured
						monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
							target: monaco.languages.typescript.ScriptTarget.Latest,
							allowNonTsExtensions: true,
							moduleResolution:
								monaco.languages.typescript.ModuleResolutionKind.NodeJs,
							module: monaco.languages.typescript.ModuleKind.CommonJS,
							noEmit: true,
							esModuleInterop: true,
							jsx: monaco.languages.typescript.JsxEmit.React,
							reactNamespace: "React",
							allowJs: true,
							typeRoots: ["node_modules/@types"],
						});

						// Create a virtual TS file for the types
						const libUri = "file:///node_modules/@types/mhsf/index.d.ts";

						// Add typedefs as a library
						monaco.languages.typescript.typescriptDefaults.addExtraLib(
							typeDefs,
							libUri,
						);

						// Create a model for the libUri file
						if (!monaco.editor.getModel(monaco.Uri.parse(libUri))) {
							monaco.editor.createModel(
								typeDefs,
								"typescript",
								monaco.Uri.parse(libUri),
							);
						}

						// Make sure the current file is using the correct language
						const currentModel = editor.getModel();
						if (currentModel) {
							monaco.editor.setModelLanguage(currentModel, "typescript");
						}

						const currentUri = monaco.Uri.parse(`file:///${filename}.ts`);
						if (!monaco.editor.getModel(currentUri)) {
							monaco.editor.createModel(fileContents, "typescript", currentUri);
							editor.setModel(monaco.editor.getModel(currentUri));
						}
					}}
					options={{
						minimap: { enabled: false },
						scrollBeyondLastLine: false,
						fontSize: 14,
						lineNumbers: "on",
						roundedSelection: false,
						scrollbar: {
							vertical: "visible",
							horizontal: "visible",
						},
						quickSuggestions: true,
						suggestOnTriggerCharacters: true,
						acceptSuggestionOnEnter: "on",
						tabCompletion: "on",
						wordBasedSuggestions: "currentDocument",
						cursorSmoothCaretAnimation: "on",
						parameterHints: {
							enabled: true,
						},
						hover: {
							enabled: true,
							delay: 300,
							sticky: true,
						},
					}}
				/>
			</div>
		</main>
	);
}

export async function findSupportedOperations(
	fileValue: string,
): Promise<{ filter: boolean; sort: boolean }> {
	const returnValue = { filter: true, sort: true };
	const transpiledValue = transpileTypeScript(fileValue);
	const functionBody = transpiledValue
		?.replace(/export default(?!.*[;])/g, "") // Avoid replacing if followed by a semicolon
		.replace(/export(?!.*[;])/g, ""); // Avoid replacing if followed by a semicolon
	const { error: filterErr, data: filterFunc } = await tryCatch(
		(async () =>
			new Function(
				"server",
				`${functionBody}
			return filter(server)`,
			))(),
	);
	const { error: sortErr, data: sortFunc } = await tryCatch(
		(async () =>
			new Function(
				"serverA",
				"serverB",
				`${functionBody}
			return sort(serverA, serverB)`,
			))(),
	);

	if (filterErr) returnValue.filter = false;
	if (sortErr) returnValue.sort = false;

	try {
		filterFunc?.({});
	} catch (e) {
		if (String(e).startsWith("ReferenceError: filter is not defined")) {
			returnValue.filter = false;
		}
	}
	try {
		sortFunc?.({}, {});
	} catch (e) {
		if (String(e).startsWith("ReferenceError: sort is not defined")) {
			returnValue.sort = false;
		}
	}

	return returnValue;
}
