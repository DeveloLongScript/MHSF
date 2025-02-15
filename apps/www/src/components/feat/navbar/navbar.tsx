"use client";

import { BrandingColorfulIcon } from "@/components/Icon";
import { version } from "@/config/version";
import { cn } from "@/lib/utils";

export function NavBar() {
  return (
    <div
      className={cn(
        "w-screen h-[3rem] border-b grid-cols-3 fixed backdrop-blur z-10",
        "items-center justify-self-start me-auto mt-2 pl-4 max-sm:mt-3 flex-1"
      )}
    >
      <div className="gap-3 flex items-center">
        <BrandingColorfulIcon className="max-w-[32px] max-h-[32px] mt-0.5" />
        <span className="gap-2 flex">
          <strong>MHSF</strong>
          <span className="text-muted-foreground">v{version}</span>
        </span>
      </div>
    </div>
  );
}
