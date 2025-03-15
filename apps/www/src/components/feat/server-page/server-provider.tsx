"use client";
import { Placeholder } from "@/components/ui/placeholder";
import { Spinner } from "@/components/ui/spinner";
import { useServer } from "@/lib/hooks/use-server";
import type { ServerResponse } from "@/lib/types/mh-server";
import { X } from "lucide-react";
import { ServerMainPage } from "./server-page";
import { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { AnimatedText } from "@/components/ui/animated-text";
import { useSettingsStore } from "@/lib/hooks/use-settings-store";
import { Button } from "@/components/ui/button";
import { DebugProvider } from "./debug/debug-provider";
import { ReportingProvider } from "./reporting/reporting-provider";

export function ServerProvider({ serverId }: { serverId: string }) {
  const { server, error, loading } = useServer({ id: serverId });
  const settings = useSettingsStore();
  const mhsf = useMHSFServer(serverId);

  if (error !== null)
    return (
      <div className="absolute top-[50%] left-[50%]">
        <Placeholder
          icon={<X />}
          title="Error while fetching server"
          description={
            <>
              Try again later <br /> If this occurs again, please contact
              support or make a GitHub issue. <br /> {error}
            </>
          }
        />
      </div>
    );

  return (
    <DebugProvider
      debugOptions={{
        serverName: (server ?? { name: "" }).name,
        serverId: serverId,
        mhsfData: mhsf.server,
        serverData: server,
        onlineServerData: null,
      }}
    >
      {loading || mhsf.loading ? (
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 block justify-center text-center gap-2">
          <span className="w-full flex justify-center">
            <Spinner />
          </span>

          <span>
            <AnimatedText
              text={
                loading && mhsf.loading
                  ? "Loading server and MHSF data..."
                  : loading
                    ? "Loading server data..."
                    : "Loading MHSF data..."
              }
              className="text-center w-full mt-2"
            />
          </span>
          {settings.get("debug-mode") === "true" && (
            <Button
              onClick={() => window.dispatchEvent(new Event("open-debug-menu"))}
            >
              Debug Stack
            </Button>
          )}
        </div>
      ) : (
        <div className="px-10">
          <ReportingProvider server={mhsf}>
            <ServerMainPage server={server as ServerResponse} mhsfData={mhsf} />
          </ReportingProvider>
        </div>
      )}
    </DebugProvider>
  );
}
