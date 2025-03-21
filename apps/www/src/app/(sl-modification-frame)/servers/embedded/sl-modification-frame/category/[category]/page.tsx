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
import { Material } from "@/components/ui/material";
import { Link } from "@/components/util/link";
import { serverModDB } from "@/config/sl-mod-db";
import { useRouter } from "@/lib/useRouter";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { use } from "react";
import Markdown from "react-markdown";

export default function ServerListCategoryFrame({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const categoryObj = serverModDB.find(
    (c) => c.displayTitle === atob(category)
  );
  const router = useRouter();

  return (
    <main className="max-w-[800px] p-4">
      <h1 className="text-xl font-bold w-full">
        <Link href="/servers/embedded/sl-modification-frame">
          <ArrowLeft />
        </Link>
        {categoryObj?.displayTitle}
      </h1>
      <Markdown className="text-wrap pt-2">{categoryObj?.description}</Markdown>

      <div className="pt-10 p-4 grid grid-cols-6 gap-2">
        {categoryObj?.entries.map((m) => (
          <Material
            className="p-2 hover:drop-shadow-card-hover cursor-pointer"
            onClick={() =>
              router.push(
                `/servers/embedded/sl-modification-frame/category/${category}/modification/${btoa(m.name)}?b=${encodeURIComponent(`/servers/embedded/sl-modification-frame/category/${category}`)}`
              )
            }
            key={m.name}
          >
            <div
              className={cn(
                "w-full h-[40px] mb-2 rounded-lg items-center text-center justify-center"
              )}
              style={{ backgroundColor: m.color }}
            >
              <m.icon className="relative top-[calc(50%-12px)] items-center w-full text-center justify-center" />
            </div>
            <span className="text-sm text-center w-full flex items-center justify-center">
              {m.name}
            </span>
          </Material>
        ))}
      </div>
    </main>
  );
}
