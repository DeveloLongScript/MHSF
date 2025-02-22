/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

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
