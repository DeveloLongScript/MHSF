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

import { ClerkCustomModification } from "@/components/feat/server-list/modification/modification-file-creation-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Material } from "@/components/ui/material";
import { Placeholder } from "@/components/ui/placeholder";
import { Link } from "@/components/util/link";
import { useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  Braces,
  EllipsisVertical,
  FileCode,
  Pencil,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

export default function ServerListModificationFrame() {
  const { user } = useUser();
  const files =
    (user?.unsafeMetadata.customFiles as Array<ClerkCustomModification>) ?? [];
  return (
    <main className="max-w-[800px] p-4">
      <h1 className="text-xl font-bold w-full flex items-center gap-2">
        <Link href="/servers/embedded/sl-modification-frame">
          <ArrowLeft size={16} />
        </Link>
        Files
      </h1>
      <Material className="grid gap-1 mt-4">
        {files.length === 0 && (
          <Placeholder
            icon={<Braces />}
            title="We couldn't find any files"
            description="Try creating a filter!"
          />
        )}
        {files.map((c, i) => (
          <Link
            href={`/servers/embedded/sl-modification-frame/file/${c.name}`}
            className="w-full py-1 px-2 rounded-xl flex items-center gap-1 justify-between hover:bg-slate-100 dark:hover:bg-zinc-700/30"
            key={c.name}
          >
            <span className="flex items-center gap-1">
              <FileCode size={16} />
              {c.name}.ts
            </span>
            <span>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="tertiary"
                    className="flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700/60"
                    size="square-sm"
                  >
                    <EllipsisVertical
                      size={16}
                      className="text-muted-foreground"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const startTime = Date.now();
                      files.splice(i, 1);
                      await user?.update({
                        unsafeMetadata: {
                          customFiles: files,
                        },
                      });
                      toast.success(
                        "Deleted file in " + (Date.now() - startTime) + "ms"
                      );
                    }}
                  >
                    <Trash size={16} /> Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Pencil size={16} /> Rename
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </Link>
        ))}
      </Material>
    </main>
  );
}
