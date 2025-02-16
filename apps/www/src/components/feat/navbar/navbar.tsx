"use client";
import { BrandingGenericIcon } from "@/components/feat/icons/branding-icons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Github from "@/components/ui/github";
import { ALegacy } from "@/components/util/link";
import { ModeToggle } from "@/components/util/mode-toggle";
import { version } from "@/config/version";
import { useScroll } from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ServerCrash } from "lucide-react";
import Link from "next/link";

export function NavBar() {
  const showBorder = useScroll(40);

  return (
    <div
      className={cn(
        "w-screen h-[3rem] grid-cols-3 fixed backdrop-blur-xl z-10 flex",
        "items-center justify-self-start me-auto pl-4 flex-1 transition-all justify-between",
        showBorder ? "border-b" : ""
      )}
    >
      <span>
        <ContextMenu>
          <ContextMenuTrigger>
            <Link className="gap-5 flex items-center " href="/">
              <BrandingGenericIcon className="max-w-[32px] max-h-[32px] mt-0.5" />
              <span className="gap-2 flex group hover:text-blue-500 hover:underline transition-all">
                <strong className="">MHSF</strong>
                <span className="text-muted-foreground group-hover:text-blue-500 transition-all">
                  v{version}
                </span>
              </span>
            </Link>
          </ContextMenuTrigger>
          <ContextMenuContent className="overflow-hidden min-w-[300px]">
            <ALegacy href="Special:Root">
              <ContextMenuItem>
                <span className="pl-2 flex gap-2 items-center">
                  <ServerCrash size={16} /> Go home
                </span>
              </ContextMenuItem>
            </ALegacy>
            <ContextMenuSeparator />
            <ALegacy href="Special:GitHub">
              <ContextMenuItem>
                <span className="pl-2 flex gap-2 items-center">
                  <Github /> Open GitHub
                </span>
              </ContextMenuItem>
            </ALegacy>
          </ContextMenuContent>
        </ContextMenu>
      </span>
      <span className="mr-3">
        <ModeToggle />
      </span>
    </div>
  );
}
