"use client";

import { use } from "react";
import { useUser } from "@clerk/nextjs";
import type { ClerkCustomModification } from "@/components/feat/server-list/modification/modification-file-creation-dialog";
import { Link } from "@/components/util/link";
import { ArrowLeft } from "lucide-react";
import Editor from "@monaco-editor/react";
import poimandres from "@/theme.json";

const typeDefs = `
export interface Server {
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
`;

export default function CustomFilePage({
  params,
}: {
  params: Promise<{ filename: string }>;
}) {
  const { filename } = use(params);
  const { user } = useUser();
  const file = (
    (user?.unsafeMetadata.customFiles as Array<ClerkCustomModification>) ?? []
  ).find((c) => c.name === filename);

  if (!file) {
    return <>Bruh.</>;
  }

  const fileContents = file.contents;

  return (
    <main className="max-w-[800px] p-4">
      <strong className="font-bold w-full">
        <Link href="/servers/embedded/sl-modification-frame/files">
          <ArrowLeft />
        </Link>
        {filename}.ts
      </strong>
      <div className="h-[400px]">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          defaultValue={fileContents}
          theme="vs-dark"
          onMount={(editor, monaco) => {
            // Ensure TypeScript is properly configured
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              target: monaco.languages.typescript.ScriptTarget.Latest,
              allowNonTsExtensions: true, // This is important!
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
              monaco.editor.createModel(
                fileContents,
                "typescript",
                currentUri,
              );
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
