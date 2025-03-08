"use client";
import { Placeholder } from "@/components/ui/placeholder";
import { Spinner } from "@/components/ui/spinner";
import { useServer } from "@/lib/hooks/use-server";
import type { OnlineServer } from "@/lib/types/mh-server";
import { X } from "lucide-react";
import { ServerMainPage } from "./server-page";

export function ServerProvider({ serverId }: { serverId: string }) {
  const { server, error, loading } = useServer({ id: serverId });

  if (loading)
    return (
      <div className="absolute top-[50%] left-[50%]">
        <Spinner />
      </div>
    );

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
    <div className="px-10">
      <ServerMainPage server={server as OnlineServer} />
    </div>
  );
}
