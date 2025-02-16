import { Material } from "@/components/ui/material";
import type { OnlineServer } from "@/lib/types/mh-server";

export function Statistics({
  totalPlayers,
  totalServers,
  topServer,
}: {
  totalPlayers: number;
  totalServers: number;
  topServer: OnlineServer;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Material className="gap-2">
        <strong>Total Players</strong> <br />
        <span className="text-lg">{totalPlayers}</span>
      </Material>
      <Material className="gap-2">
        <strong>Total Servers</strong> <br />
        <span className="text-lg">{totalServers}</span>
      </Material>
      <Material className="gap-2">
        <strong>Top Server</strong> <br />
        <span className="text-lg">{topServer.name}</span>
      </Material>
    </div>
  );
}
