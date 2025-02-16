import { useEffect, useState } from "react";
import type { OnlineServer } from "../types/mh-server";

export function useServers() {
  const [servers, setServers] = useState<OnlineServer[]>([]);
  const [serverCount, setServerCount] = useState<number>(0);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      (async () => {
        const serversFetch = await fetch("https://api.minehut.com/servers");
        const serversJson: ServersAPIResponse = await serversFetch.json();

        setPlayerCount(serversJson.total_players);
        setServerCount(serversJson.total_servers);
        setServers(serversJson.servers);
        setLoading(false);
      })();
    } catch (e) {
      console.error(e);
      setError(true);
    }
  }, []);

  return {
    servers,
    playerCount,
    serverCount,
    loading,
    error,
  };
}

export type ServersAPIResponse = {
  servers: OnlineServer[];
  // stats
  total_players: number;
  total_search_results: number;
  total_servers: number;
};
