"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OnlineServer, ServerResponse } from "@/lib/types/mh-server";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function IconDisplay(props: {
  server: OnlineServer | ServerResponse;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div>
          <i
            className={cn(
              props.server.icon != null
                ? `icon-minecraft icon-minecraft-
                      ${props.server.icon.replaceAll("_", "-").toLowerCase()}`
                : "icon-minecraft icon-minecraft-oak-sign",
              props.className
            )}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-mono">
          {props.server.icon != null
            ? props.server.icon.toLowerCase()
            : "oak_sign"}
        </div>
        {props.server.icon == null && (
          <div>
            (this is the icon that loads in the lobby, the icon has not been
            picked)
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

export function IconDisplayClient(props: { server: string }) {
  const [icon, setIcon] = useState("");

  useEffect(() => {
    fetch(`https://api.minehut.com/server/${props.server}?byName=true`).then(
      (b) => b.json().then((c) => setIcon(c.server.icon))
    );
  }, [props.server]);

  return (
    <>
      {icon !== "" && (
        <Tooltip>
          <TooltipTrigger>
            <i
              className={cn(
                icon != null
                  ? `icon-minecraft icon-minecraft-
                        ${icon.replaceAll("_", "-").toLowerCase()}`
                  : "icon-minecraft icon-minecraft-oak-sign",
                "w-[16px] h-[16px]"
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <div className="font-mono">
              {icon != null ? icon.toLowerCase() : "oak_sign"}
            </div>
            {icon == null && <div>(default icon)</div>}
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
