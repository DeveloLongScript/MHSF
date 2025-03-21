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
import { Link } from "@/components/util/link";
import { useUser } from "@clerk/nextjs";
import { File, FileCode } from "lucide-react";

export default function ServerListModificationFrame() {
  const { user } = useUser();
  const files =
    (user?.unsafeMetadata.customFiles as Array<ClerkCustomModification>) ?? [];
  return (
    <main className="max-w-[800px] p-4">
      <h1 className="text-xl font-bold w-full">Files</h1>
      <div className="grid gap-1">
        {files.map((c) => (
          <Link href={`/servers/embedded/sl-modification-frame/file/${c.name}`} className="w-full py-1 px-2 rounded-xl flex items-center gap-1 hover:bg-slate-100" key={c.name}>
            <FileCode size={16}/>{c.name}.ts
          </Link>
        ))}
      </div>
    </main>
  );
}
