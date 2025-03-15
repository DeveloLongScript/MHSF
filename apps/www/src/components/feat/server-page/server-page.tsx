"use client";
import type { ServerResponse } from "@/lib/types/mh-server";
import IconDisplay from "../icons/minecraft-icon-display";
import { ServerPageTags } from "./server-page-tags";
import { Separator } from "@/components/ui/separator";
import { ServerRows } from "./server-rows";
import { ServerPageButtons } from "./server-page-buttons";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function ServerMainPage({
  server,
  mhsfData,
}: {
  server: ServerResponse;
  mhsfData: ReturnType<typeof useMHSFServer>;
}) {
  useEffect(() => {
    if (mhsfData.server?.customizationData.banner !== undefined)
      window.dispatchEvent(new Event("force-dark-mode"));
  });

  return (
    <div
      className={cn(
        "xl:px-[100px]",
        mhsfData.server?.customizationData.banner === undefined
          ? "pt-[150px]"
          : "pt-[300px]"
      )}
    >
      {mhsfData.server?.customizationData.banner && (
        <img
          src={mhsfData.server?.customizationData.banner}
          alt="User provided banner for server"
          className="rounded align-middle block ml-auto mr-auto absolute left-0 z-0 w-full object-fill"
          style={{
            maskImage: "linear-gradient(to top, transparent, black)",
            top: "0",
          }}
        />
      )}
      <span className="flex items-center gap-2 w-full relative">
        <div className="bg-secondary p-4 rounded-lg ml-4">
          <IconDisplay server={server} />
        </div>
        <p className="w-full">
          <div className="flex justify-between w-full">
            <h1 className="text-2xl font-bold">{server.name}</h1>
            <span>
              <ServerPageButtons server={server} mhsfData={mhsfData} />
            </span>
          </div>
          <span className="flex items-center gap-2 flex-wrap">
            <ServerPageTags server={server} className="mt-1" />
          </span>
        </p>
      </span>
      <Separator className="my-6" />
      <ServerRows server={server} mhsfData={mhsfData} />
    </div>
  );
}
