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

import { ModificationAction } from "@/components/feat/server-list/modification/modification-action";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/util/link";
import { serverModDB } from "@/config/sl-mod-db";
import { ArrowLeft } from "lucide-react";
import { useQueryState } from "nuqs";
import { use } from "react";
import Markdown from "react-markdown";

export default function ModificationPage({
  params,
}: {
  params: Promise<{ category: string; mod: string }>;
}) {
  const { category, mod } = use(params);
  const [backRoute] = useQueryState("b", {
    defaultValue: "/servers/embedded/sl-modification-frame",
  });
  console.log(mod);
  const categoryObj = serverModDB.find(
    (c) => c.displayTitle === atob(decodeURIComponent(category))
  );
  let modObj = null;
  if (categoryObj !== undefined)
    modObj = categoryObj?.entries.find(
      (c) => c.name === atob(decodeURIComponent(mod))
    );

  return (
    <main className="p-4">
      <div
        className="h-[150px] w-full rounded-xl p-2"
        style={{ backgroundColor: modObj?.color }}
      >
        <Link href={backRoute}>
          <ArrowLeft />
        </Link>
      </div>

      <span className="p-4">
        <h1 className="text-xl font-bold w-full">{modObj?.name}</h1>
        <Markdown className="text-wrap pt-2">{modObj?.description}</Markdown>
        <ModificationAction value={modObj?.value} />
      </span>
    </main>
  );
}
