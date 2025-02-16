"use client";
import { BrandingGenericIcon } from "@/components/feat/icons/branding-icons";
import { version } from "@/config/version";
import { useScroll } from "@/lib/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavBar() {
  const showBorder = useScroll(40);

  return (
    <div
      className={cn(
        "w-screen h-[3rem] grid-cols-3 fixed backdrop-blur-xl z-10 flex",
        "items-center justify-self-start me-auto pl-4 flex-1 transition-all",
        showBorder ? "border-b" : ""
      )}
    >
      <Link className="gap-5 flex items-center " href="/">
        <BrandingGenericIcon className="max-w-[32px] max-h-[32px] mt-0.5" />
        <span className="gap-2 flex group hover:text-blue-500 hover:underline transition-all">
          <strong className="">MHSF</strong>
          <span className="text-muted-foreground group-hover:text-blue-500 transition-all">
            v{version}
          </span>
        </span>
      </Link>
    </div>
  );
}
