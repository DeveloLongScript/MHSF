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

import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "px-2.5 py-1 text-xs font-medium flex items-center gap-1 ring-1 ring-inset",
  {
    variants: {
      variant: {
        default:
          "bg-shadcn-primary text-shadcn-primary-foreground ring-transparent",
        red: "bg-red-500 text-white ring-transparent",
        green: "bg-green-500 text-white dark:text-black ring-transparent",
        yellow: "bg-yellow-500 text-black ring-transparent",
        gray: "bg-gray-600 text-white ring-transparent",
        blue: "bg-blue-500 text-white ring-transparent",
        purple: "bg-purple-500 text-white ring-transparent",
        "red-subtle": `bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400
		ring-red-400 dark:ring-red-500/30`,
        "green-subtle": `bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400
		ring-green-400 dark:ring-green-500/30`,
        "yellow-subtle": `bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400
		ring-yellow-400 dark:ring-yellow-500/30`,
        "gray-subtle": `bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300
		ring-gray-400 dark:ring-gray-400/30`,
        "blue-subtle": `bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300
		ring-blue-400 dark:ring-blue-400/30`,
        "purple-subtle": `bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400
		ring-purple-400 dark:ring-purple-500/30`,
        rainbow:
          "text-white ring-transparent z-10 bg-blur-[15px] rainbow-tag",
        custom: "",
      },
      allowIconOnly: {
        true: "max-md:px-1.5 max-md:py-1.5",
        false: null,
      },
      badgeRoundness: {
        full: "rounded-full",
        md: "rounded-md",
        custom: "",
      },
    },
    defaultVariants: {
      variant: "gray-subtle",
      allowIconOnly: false,
      badgeRoundness: "full",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
