import { ReactNode, useEffect, useState } from "react";
import { DebugMenu } from "./debug-menu";
import type { MHSFData } from "@/lib/types/data";
import type { RouteParams } from "@/pages/api/v1/server/get/[server]";
import type { OnlineServer, ServerResponse } from "@/lib/types/mh-server";
import { useHotkeys } from "react-hotkeys-hook";
import { useSettingsStore } from "@/lib/hooks/use-settings-store";

export function DebugProvider({
  debugOptions,
  children,
}: {
  debugOptions: {
    serverName: string;
    serverId: string;
    mhsfData: (MHSFData & RouteParams) | null;
    serverData: ServerResponse | null;
    onlineServerData: OnlineServer | null;
  };
  children: ReactNode | ReactNode[];
}) {
  const [open, setOpen] = useState(false);
  const settingsStore = useSettingsStore();

  useHotkeys(
    "ctrl+shift+o",
    () => {
      if (settingsStore.get("debug-mode") === "true") setOpen(!open);
    },
    [open]
  );

  useEffect(() => {
    window.addEventListener("open-debug-menu", () => {
      setOpen(true);
    });
  }, []);

  return (
    <>
      <DebugMenu open={open} setOpen={setOpen} debugOptions={debugOptions} />
      {children}
    </>
  );
}
