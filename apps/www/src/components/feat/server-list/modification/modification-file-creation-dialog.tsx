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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/lib/useRouter";
import { useUser } from "@clerk/nextjs";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

const sortTemplate = `import type { Minehut } from "mhsf";

export function sort(serverA: Minehut.OnlineServer, serverB: Minehut.OnlineServer): number {
    // Your code here
    // Use logic like \`Array.sort\` or <V>(a: V, b: V) => number
}`;

const filterTemplate = `import type { Minehut } from "mhsf";

export function filter(server: Minehut.OnlineServer): boolean {
    // Your code here
    // Returning true indicates the server will stay, while returning false will remove the server from the queue.
}`;

export type ClerkCustomModification = {
  name: string; // Add .ts to the end
  active: boolean;
  contents: string;
  testId?: string;
};

export type ClerkCustomActivatedModification = {
  originalFileName: string;
  friendlyName: string;
  transpiledContents: string;
  active: boolean;
  testMode: "filter" | "sort";
  color: string;
}

export function ModificationFileCreationDialog({
  children,
  type,
}: {
  children?: ReactNode;
  type: "filter" | "sort";
}) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [fileName, setFileName] = useState("");

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Create new file</DialogTitle>
        <DialogDescription>
          Files can be a new filter or sort, made w/ TypeScript.
        </DialogDescription>
        <div className="flex items-center w-full">
          <Input
            className="rounded-r-none w-full"
            placeholder="you-should-use-this-format-for-typescript-files-please"
            onChange={(e) => setFileName(e.target.value)}
            value={fileName}
          />
          <span className="px-4 text-sm py-2 border border-l-none rounded-r-md">
            .ts
          </span>
        </div>

        <br />
        <DialogTrigger>
          <Button
            className="w-full"
            onClick={async (e) => {
              if (!isSignedIn) return toast.error("Please login.");
              await user?.update({
                unsafeMetadata: {
                  ...user.unsafeMetadata,
                  customFiles: [
                    ...((user.unsafeMetadata
                      .customFiles as Array<ClerkCustomModification>) ?? []),
                    {
                      name: fileName,
                      active: false,
                      contents:
                        type === "filter" ? filterTemplate : sortTemplate,
                    },
                  ] satisfies Array<ClerkCustomModification>,
                },
              });
              toast.success("Created file!")
              router.push(`/servers/embedded/sl-modification-frame/file/${fileName}`)
            }}
          >
            Submit
          </Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
