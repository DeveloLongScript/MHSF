"use client";

import { use, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { ClerkCustomModification } from "@/components/feat/server-list/modification/modification-file-creation-dialog";
import { Link } from "@/components/util/link";
import { AlertOctagon, ArrowLeft, ExternalLink } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as ts from "typescript";
import useClipboard from "@/lib/useClipboard";
import { useTheme } from "@/lib/hooks/use-theme";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { languages, Uri } from "monaco-editor";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Alert } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { compressToEncodedURIComponent } from "lz-string";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { tryCatch } from "@/lib/try-catch";

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

const geistMono = Geist_Mono({ subsets: ["latin"] });

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
    return <>Bruh.</>;
  }

  const validateCode = (code: string) => {
    if (!monacoRef.current) return;

    monacoRef.current.languages.typescript
      .getTypeScriptWorker()
      .then((worker) => {
        worker(
          monacoRef.current?.Uri.parse(`file:///${filename}.ts`) as Uri
        ).then((client) => {
          client
            .getSemanticDiagnostics(
              (
                monacoRef.current?.Uri.parse(`file:///${filename}.ts`) as Uri
              ).toString()
            )
            .then((diags) => {
              setSyntaxErrors(diags);
            });
        });
      });
  };

  const fileContents = ((user?.unsafeMetadata
    .customFiles as Array<ClerkCustomModification>) ?? [])[file].contents;
  const [value, setValue] = useState(fileContents);
  const clipboard = useClipboard();
  validateCode(value);

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
        customFiles: metadata,
      },
    });
  };

  const lintFile = async () => {
    toast.info("Transpiling TypeScript...");
    const { error, data: transpiledCode } = await tryCatch(
      (async () => transpileTypeScript(value))()
    );
    if (error) {
      toast.error("Failed to transpile TypeScript! Error: " + error.message);
      return;
    }
    const startTime = Date.now();
    if (transpiledCode === null) {
      toast.error("Cannot continue.");
      return;
    }
    console.log("[MHSF Filters] Transpiled TypeScript:", transpiledCode ?? "");
    toast.info("Generating function...");
    const functionBody = transpiledCode.match(
      /function\s+filter\s*\([^)]*\)\s*\{([\s\S]*)\}/
    )?.[1];
    const { error: filterErr, data: filterFunc } = await tryCatch(
      (async () => new Function("data", functionBody as string))()
    );
    if (filterErr) {
      toast.error(`Failed to generate function! Error: ${filterErr.message}`);
      return;
    }
    if (typeof filterFunc === "function") {
      toast.success("Linted in " + (Date.now() - startTime) + "ms");
      setSuccessfullyLinted(true);
    } else {
      toast.error("Code doesn't have a 'filter' function. Cannot be tested.");
      toast.error(typeof filterFunc);
    }
  };

  const debouncedSave = debounce(async () => {
    const { error } = await tryCatch(saveFile());
    if (error)
      toast.error(
        "Whoa! We encountered an error while auto-saving. Please copy your code locally to ensure you'll keep your code changes."
      );
  }, 300);

  useEffect(() => {
    setSuccessfullyLinted(false);
    validateCode(value);
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
                            noExtraIcons
                            target="_blank"
                            href={`https://typescript.tv/errors/#ts${c.code}`}
                          >
                            <DropdownMenuItem>typescript.tv</DropdownMenuItem>
                          </Link>
                          <Link
                            noExtraIcons
                            target="_blank"
                            href={`https://ts-error-translator.vercel.app/?error=${compressToEncodedURIComponent(c.messageText.toString())}`}
                          >
                            <DropdownMenuItem>
                              ts-error-translator
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Alert>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          )}
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={lintFile}
                disabled={syntaxErrors === null || syntaxErrors.length !== 0}
                variant={successfullyLinted ? "success-subtle" : "secondary"}
              >
                Lint
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {syntaxErrors !== null && syntaxErrors.length !== 0
                ? "You must have no type errors in the editor to lint, you have " +
                  syntaxErrors.length +
                  " error(s)."
                : "Check for possible runtime errors."}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                disabled={!successfullyLinted}
                onClick={() => {
                  const t = btoa(value);

                  const newTab = window.open(`/servers?tm=${encodeURIComponent(t)}`)
                  const interval = setInterval(() => {
                    newTab?.dispatchEvent(new Event("test-mode.enable"))
                  }, 500)
                  toast.info("Waiting for server tab to pick up thread...")

                  newTab?.addEventListener("test-mode.enabled", () => {
                    clearInterval(interval);
                    toast.success("Connected to new tab; continue.")
                  })
                }}
              >
                Test
              </Button>
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
              libUri
            );

            // Add actions
            [
              {
                id: "manually-save-file",
                label: "MHSF: Manually Save File",
                run: () => {
                  saveFile();
                  toast.success("Manually saved file!");
                },
              },
              {
                id: "lint-file",
                label: "MHSF: Lint File",
                run: lintFile
              },
            ].forEach((e) => editor.addAction(e));

            // Create a model for the libUri file
            if (!monaco.editor.getModel(monaco.Uri.parse(libUri))) {
              monaco.editor.createModel(
                typeDefs,
                "typescript",
                monaco.Uri.parse(libUri)
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

function guidGenerator() {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}
