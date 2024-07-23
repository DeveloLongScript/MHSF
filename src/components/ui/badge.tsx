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
