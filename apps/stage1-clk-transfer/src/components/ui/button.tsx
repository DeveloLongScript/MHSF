/*
 * MHSF, Minehut Server List
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
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-4 focus:ring-neutral-300 focus:ring-offset-current dark:focus:ring-neutral-500 duration-150 ease-in-out transition-all",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-4 focus:ring-red-300 focus:ring-offset-current dark:focus:ring-red-950 duration-150 ease-in-out transition-all",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-4 focus:ring-neutral-100 focus:ring-offset-current dark:focus:ring-neutral-900 duration-150 ease-in-out transition-all",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-4 focus:ring-neutral-300 focus:ring-offset-current dark:focus:ring-neutral-500 duration-150 ease-in-out transition-all",
        ghost:
          "hover:bg-accent hover:text-accent-foreground focus:ring-4 focus:ring-neutral-100 focus:ring-offset-current dark:focus:ring-neutral-900 duration-150 ease-in-out transition-all",
        link: "text-primary underline-offset-4 hover:underline",
        favorite:
          "text-black rounded-lg hover:bg-primary/90 focus:ring-4 focus:ring-yellow-400/60 focus:ring-offset-current dark:focus:ring-yellow-400/60 duration-150 ease-in-out transition-all bg-gradient-to-bl from-yellow-300 via-yellow-500 to-yellow-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  noJustify?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, noJustify = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }) +
            " " +
            (noJustify ? "" : "justify-center")
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
