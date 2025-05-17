import { useState } from "react";
import type { OnlineServer, ServerResponse } from "../types/mh-server";
import { useEffectOnce } from "../useEffectOnce";

export function useServer(serverSpecifier: { id?: string; name?: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [server, setServer] = useState<ServerResponse | null>(null);
  const [onlineServer, setOnlineServer] = useState<OnlineServer | null>(null);

  useEffectOnce(() => {
    try {
      (async () => {
        const res = await fetch(
          `https://api.minehut.com/server/${serverSpecifier.id || serverSpecifier.name}${serverSpecifier.name ? "?byName=true" : ""}`
        );
        const json = await res.json();
        if (json.server === null) throw new Error("Server not found");

        if (server?.online) {
          const res = await fetch("https://api.minehut.com/servers");
          const json = await res.json() as {servers: OnlineServer[]};
          const onlineServerData = json.servers.find((s) => s.staticInfo._id === server._id) ?? null;
          if (onlineServerData) {
            setOnlineServer(onlineServerData);
          }
        }

        setServer(json.server);
        setLoading(false);
      })();
    } catch (e) {
      console.log("Error occurred while fetching server data", e);
      setError((e as Error).message);
      setLoading(false);
    }
  });

  return { loading, error, server, onlineServer };
}
