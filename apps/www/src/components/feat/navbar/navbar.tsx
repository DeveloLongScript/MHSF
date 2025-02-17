"use client";
import { BrandingGenericIcon } from "@/components/feat/icons/branding-icons";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Github from "@/components/ui/github";
import { ALegacy } from "@/components/util/link";
import { version } from "@/config/version";
import { useScroll } from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Menu, ServerCrash } from "lucide-react";
import Link from "next/link";
import { MenuDropdown } from "./menu-dropdown";

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
            <ALegacy href="Special:GitHub/releases">
              <ContextMenuItem>
                <span className="pl-2 flex gap-2 items-center">
                  <Github /> Open GitHub Releases
                </span>
              </ContextMenuItem>
            </ALegacy>
          </ContextMenuContent>
        </ContextMenu>
      </span>
      <span className="mr-3 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              className="rounded-full flex items-center"
              size="square-lg"
              variant="secondary"
            >
              <Menu size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-[280px] w-[280px] mt-2 mr-2">
            <MenuDropdown />
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </div>
  );
}
