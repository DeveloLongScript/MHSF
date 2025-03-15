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

import { CircleAlert } from "lucide-react";
import { Material } from "./material";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function Alert({
  children,
  icon,
  className,
  variant,
}: {
  children?: ReactNode | ReactNode[] | undefined;
  icon?: ReactNode | ReactNode[] | undefined;
  className?: string | undefined;
  variant?: "error" | "info" | "normal" | "warning" | undefined;
}) {
  return (
    <Material
      padding="sm"
      className={cn(
        "flex flex-row items-center",
        variant === "error"
          ? "bg-[#fdeded_!important] dark:bg-[#160b0b_!important]"
          : variant === "warning"
            ? "bg-[#fef4e5_!important] dark:bg-[#191209_!important]"
            : variant === "info"
              ? "bg-[#e5f6fd_!important] dark:bg-[#091418_!important]"
              : "",
        className
      )}
    >
      {icon ? (
        icon
      ) : (
        <div className="flex items-center justify-center h-full">
          <CircleAlert
            size={16}
            className={
              variant === "error"
                ? "text-[#d76463] dark:text-[#df2317]"
                : variant === "warning"
                  ? "text-[#eea065] dark:text-[#e3920a]"
                  : variant === "info"
                    ? "text-[#67b1d5] dark:text-[#1a97e3]"
                    : ""
            }
          />
        </div>
      )}
      <p className="flex-1">{children}</p>
    </Material>
  );
}

export { Alert };
