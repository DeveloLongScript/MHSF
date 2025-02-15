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

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // All custom colors in MHSF
        red: "border-transparent bg-red-300 text-primary-foreground hover:bg-red-300/80",
        orange:
          "border-transparent bg-orange-300 text-primary-foreground hover:bg-orange-300/80",
        yellow:
          "border-transparent bg-yellow-300 text-primary-foreground hover:bg-yellow-300/80",
        green:
          "border-transparent bg-green-300 text-primary-foreground hover:bg-green-300/80",
        lime: "border-transparent bg-lime-300 text-primary-foreground hover:bg-lime-300/80",
        blue: "border-transparent bg-blue-300 text-primary-foreground hover:bg-blue-300/80",
        teal: "border-transparent bg-teal-300 text-primary-foreground hover:bg-teal-300/80",
        cyan: "border-transparent bg-cyan-300 text-primary-foreground hover:bg-cyan-300/80",
        violet:
          "border-transparent bg-violet-300 text-primary-foreground hover:bg-violet-300/80",
        indigo:
          "border-transparent bg-indigo-300 text-primary-foreground hover:bg-indigo-300/80",
        purple:
          "border-transparent bg-purple-300 text-primary-foreground hover:bg-purple-300/80",
        fuchsia:
          "border-transparent bg-fuchsia-300 text-primary-foreground hover:bg-fuchsia-300/80",
        pink: "border-transparent bg-pink-300 text-primary-foreground hover:bg-pink-300/80",
        // End
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
