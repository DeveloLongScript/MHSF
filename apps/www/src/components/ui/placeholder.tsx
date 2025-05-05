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

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function Placeholder({
  icon,
  title,
  description,
  children,
  className
}: {
  icon?: ReactNode;
  title?: ReactNode | string;
  description?: ReactNode | string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("text-slate-700 dark:text-zinc-300 flex flex-col justify-center items-center gap-2", className)}>
      {icon && (
        <div className="border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 p-3 rounded-full">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-slate-900 dark:text-zinc-100 text-lg font-medium">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-center font-normal">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export { Placeholder };
