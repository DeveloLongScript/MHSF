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
import {
  BrandingGenericIcon,
  brandingIconClipboard,
} from "@/components/feat/icons/branding-icons";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Github from "@/components/ui/github";
import { Link } from "@/components/util/link";
import { version } from "@/config/version";
import { useScroll } from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Home, Image, Menu, ServerCrash } from "lucide-react";
import { MenuDropdown } from "./menu-dropdown";
import useClipboard from "@/lib/useClipboard";
import { toast } from "sonner";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import NextImage from "next/image";
import { usePathname } from "next/navigation";

const animatedTopbarPages = ["/home"];

export function NavBar() {
  const showBorder = useScroll(40);
  const clipboard = useClipboard();
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div
      className={cn(
        "w-screen h-[3rem] grid-cols-3 fixed backdrop-blur-xl z-10 flex",
        "items-center justify-self-start me-auto pl-4 flex-1 transition-all justify-between",
        showBorder ? "border-b" : "",
        pathname !== null && animatedTopbarPages.includes(pathname)
          ? "[--animation-delay:1000ms] opacity-0 animate-fade-in"
          : ""
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
            <DropdownMenuSeparator>Platform</DropdownMenuSeparator>
            <Link href="Special:Root">
              <ContextMenuItem>
                <span className="pl-2 flex gap-2 items-center">
                  <ServerCrash size={16} /> Go to Dynamic Home Page
                </span>
              </ContextMenuItem>
            </Link>

            <Link href="/home">
              <ContextMenuItem>
                <span className="pl-2 flex gap-2 items-center">
                  <Home size={16} /> Go to Home Page
                </span>
              </ContextMenuItem>
            </Link>
            <ContextMenuSeparator />

            <ContextMenuItem
              onClick={() => {
                clipboard.writeText(brandingIconClipboard);
                toast.success("Copied icon to clipboard!");
              }}
            >
              <span className="pl-2 flex gap-2 items-center">
                <Image size={16} /> Copy Logo as SVG
              </span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <Link href="Special:GitHub">
              <ContextMenuItem>
                <span className="pl-2 flex gap-2 items-center">
                  <Github /> Open GitHub
                </span>
              </ContextMenuItem>
            </Link>
            <Link href="Special:GitHub/releases">
              <ContextMenuItem>
                <span className="pl-2 flex gap-2 items-center">
                  <Github /> Open GitHub Releases
                </span>
              </ContextMenuItem>
            </Link>
          </ContextMenuContent>
        </ContextMenu>
      </span>
      <span className="mr-3 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <SignedOut>
              <Button
                className={cn(
                  "rounded-full flex items-center",
                  pathname !== null && animatedTopbarPages.includes(pathname)
                    ? "[--animation-delay:2000ms] opacity-0 animate-fade-in"
                    : ""
                )}
                size="square-lg"
                variant="secondary"
              >
                <Menu size={16} />
              </Button>
            </SignedOut>
            <SignedIn>
              <Button
                size="square-lg"
                variant="tertiary"
                className={cn(
                  "rounded-full flex items-center",
                  pathname !== null && animatedTopbarPages.includes(pathname)
                    ? "[--animation-delay:2000ms] opacity-0 animate-fade-in"
                    : ""
                )}
              >
                <NextImage
                  alt="Clerk Image"
                  src={
                    user?.imageUrl === undefined
                      ? "https://img.clerk.com/preview.png?size=144&seed=seed&initials=AD&isSquare=true&bgType=marble&bgColor=6c47ff&fgType=silhouette&fgColor=FFFFFF&type=user&w=48&q=75"
                      : user?.imageUrl
                  }
                  width={26}
                  height={26}
                  className="rounded-full"
                />
              </Button>
            </SignedIn>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-[280px] w-[280px] mt-2 mr-2">
            <MenuDropdown />
          </DropdownMenuContent>
        </DropdownMenu>
        <SignedIn>
          <div
            className="absolute right-0 -z-10 h-full
       overflow-hidden w-full ml-auto"
            style={{ borderRadius: "inherit" }}
          >
            <img
              src={user?.imageUrl ?? ""}
              className="blur-2xl -z-10 object-cover w-48 h-48 opacity-20 dark:opacity-50 ml-auto"
              alt=""
            />
          </div>
        </SignedIn>
      </span>
    </div>
  );
}
