import { cn } from "@/lib/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { Material } from "./material";
import { Button, type ButtonProps } from "./button";

const MenuContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    { className, align = "start", side = "bottom", sideOffset = 4, ...props },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        side={side}
        className={cn(
          "backdrop-blur-xl w-max max-w-[280px] origin-top-left max-h-[32rem] overflow-auto list-none shadow-xl rounded-xl",
          className
        )}
        {...props}
      >
        <div className="animate-scale-in">
          <Material
            className="flex flex-col py-2 list-none bg-white/80 dark:bg-zinc-900/80 px-2"
            color="distinct"
            padding="none"
            rounding="xl"
          >
            <div className="overflow-y-auto max-h-[calc(32rem-1rem)]">
              {props.children}
            </div>
          </Material>
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);

MenuContent.displayName = PopoverPrimitive.Content.displayName;

function MenuButton(props: ButtonProps) {
  const variant = props.variant ?? "tertiary";
  const alignment = props.alignment ?? "left";

  return (
    <Button
      rounding="none"
      className={cn(
        "w-full px-2 rounded-lg min-h-[36px] font-normal flex items-center",
        props.disabled
          ? "opacity-70 pointer-events-none cursor-not-allowed"
          : "",
        variant === "tertiary" ? "hover:dark:bg-zinc-800/70" : "",
        "duration-100",
        props.className
      )}
      variant={variant}
      alignment={alignment}
      {...props}
    />
  );
}

function MenuButtonPrefix({ children }: { children: React.ReactNode }) {
  return <span className="contents flex-shrink-0">{children}</span>;
}

function MenuSeparator({ children }: { children?: React.ReactNode }) {
  return (
    <span className="text-slate-800 dark:text-zinc-200 text-xs font-medium py-2 px-2 block">
      {children}
    </span>
  );
}

export { MenuContent, MenuButton, MenuButtonPrefix, MenuSeparator };
