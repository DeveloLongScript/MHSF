"use client";
import type { ServerResponse } from "@/lib/types/mh-server";
import IconDisplay from "../icons/minecraft-icon-display";
import { ServerPageTags } from "./server-page-tags";
import { Separator } from "@/components/ui/separator";
import { ServerRows } from "./server-rows";
import { ServerPageButtons } from "./server-page-buttons";

export function ServerMainPage({ server }: { server: ServerResponse }) {
  return (
    <div className="pt-[150px] xl:px-[100px]">
      <span className="flex items-center gap-2 w-full">
        <div className="bg-secondary p-4 rounded-lg ml-4">
          <IconDisplay server={server} />
        </div>
        <p className="w-full">
          <div className="flex justify-between w-full">
            <h1 className="text-2xl font-bold">{server.name}</h1>
            <span>
              <ServerPageButtons server={server} />
            </span>
          </div>
          <span className="flex items-center gap-2 flex-wrap">
            <ServerPageTags server={server} className="mt-1" />
          </span>
        </p>
      </span>
      <Separator className="my-6" />
      <ServerRows server={server} />
    </div>
  );
}
