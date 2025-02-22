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

import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const cardVariants = cva("text-sm", {
  variants: {
    elevation: {
      flat: "",
      low: "shadow-2xs",
      medium: "shadow-xs",
      high: "shadow-md",
      xhigh: "shadow-lg",
      max: "shadow-xl",
    },
    padding: {
      none: "p-0",
      sm: "p-2",
      md: "p-4",
      lg: "p-5",
      xl: "p-6",
    },
    rounding: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      full: "rounded-full",
    },
    color: {
      default:
        "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-b-slate-300 dark:border-t-zinc-700",
      distinct:
        "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-b-slate-300 dark:border-t-zinc-700",
      transparent:
        "border border-slate-200 dark:border-zinc-900 border-b-slate-300 dark:border-t-zinc-800",
      none: "",
    },
  },
  defaultVariants: {
    elevation: "flat",
    padding: "md",
    rounding: "lg",
    color: "default",
  },
});

export interface MaterialProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof cardVariants> {}

const Material = forwardRef<HTMLDivElement, MaterialProps>(
  ({ className, elevation, padding, rounding, color, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cardVariants({
          elevation,
          padding,
          rounding,
          color,
          className,
        })}
        {...props}
      />
    );
  }
);

Material.displayName = "Material";

export { Material };
