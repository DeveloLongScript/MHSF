import { useEffect, useState } from "react";
import type { OnlineServer } from "../types/mh-server";
import MiniMessage from "minimessage-js";

export function useMOTD(servers: OnlineServer[]) {
  const [motdList, setMotdList] = useState<{ name: string; motd: string }[]>(
    []
  );

  useEffect(() => {
    setMotdList(
      servers.map((server) => {
        return {
          name: server.name,
          motd: MiniMessage.miniMessage().toHTML(
            MiniMessage.miniMessage().deserialize(server.motd)
          ),
        };
      })
    );
  }, [servers]);

  return {
    motdList,
    getMotdForServer: (server: OnlineServer) =>
      motdList.find((c) => c.name === server.name)?.motd,
  };
}
