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

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "text-sm transition-all font-medium cursor-pointer duration-75 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: `border border-transparent bg-primary-900 text-white
		 dark:bg-primary-100 dark:text-black hover:brightness-125 dark:hover:brightness-90 active:brightness-90
		 dark:active:brightness-75`,

        secondary: `border border-slate-200 border-b-slate-300 dark:border-zinc-800 dark:border-t-zinc-700/50 bg-white dark:bg-zinc-900
		    hover:bg-slate-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:border-zinc-700 dark:active:bg-zinc-900 active:bg-slate-200`,

        tertiary:
          "border border-transparent bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-700/30 dark:text-zinc-200",

        danger:
          "border border-red-500 bg-red-500 hover:text-red-500 hover:bg-transparent text-white",
        "danger-subtle": "text-red-500 hover:bg-red-500 hover:text-inherit!",

        "success-subtle":
          "text-green-500 hover:bg-green-500 hover:text-inherit!",

        "warning-subtle":
          "text-yellow-500 hover:bg-yellow-500 hover:text-inherit!",

        ghost: `border border-slate-200 dark:border-zinc-800 bg-transparent
		            hover:bg-slate-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:text-zinc-400 hover:text-inherit
		            dark:hover:text-inherit`,

        elevated: `bg-slate-100 dark:bg-zinc-800 border border-slate-200
	                        dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:border-slate-300
	                        dark:hover:border-zinc-600`,

        elevatedLow: `bg-slate-100 dark:bg-zinc-900 border border-slate-200
	                        dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-slate-300
	                        dark:hover:border-zinc-700`,

        none: "",
      },
      size: {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-1.5 text-xs",
        default: "px-3 py-1.5",
        lg: "px-4 py-2",
        xl: "px-6 py-3",
        "square-sm": "w-6 h-6",
        "square-md": "w-8 h-8",
        "square-lg": "w-10 h-10",
        "square-xl": "w-12 h-12",
        custom: "",
      },
      alignment: {
        left: "justify-start text-left origin-left",
        center: "justify-center text-center origin-center",
        right: "justify-end text-right origin-right",
      },
      shadow: {
        sm: "shadow-xs",
        none: "shadow-none",
      },
      rounding: {
        pill: "rounded-full",
        xl: "rounded-xl",
        lg: "rounded-lg",
        md: "rounded-md",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      alignment: "center",
      shadow: "none",
      rounding: "lg",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      alignment,
      shadow,
      rounding,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
            alignment,
            shadow,
            rounding,
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
