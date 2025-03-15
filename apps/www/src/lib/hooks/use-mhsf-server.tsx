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
import type { MHSFData } from "../types/data";
import type { RouteParams } from "@/pages/api/v1/server/get/[server]";

export function useMHSFServer(id: string) {
  const [server, setServer] = useState<(MHSFData & RouteParams) | null>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/v1/server/get/" + id);
      const json = await response.json();

      console.log(json.server);

      setServer(json.server);
    })();
  }, [id]);

  return {
    server,
    loading: server === null,
    reloadServerData: async () => {
      const response = await fetch("/api/v1/server/get/" + id);
      const json = await response.json();

      setServer(json.server);
    },
    favoriteServer: async () => {
      if (!server)
        throw new Error("Server hasn't initialized, cannot continue.");

      const response = await fetch(server?.actions.favorite);
      const json: { favorited: boolean } = await response.json();

      return json;
    },
    ownServer: async () => {
      if (!server)
        throw new Error("Server hasn't initialized, cannot continue.");

      const response = await fetch(server?.actions.own);

      if (!response.ok)
        throw new Error(
          "Player doesn't own server or a server error occurred."
        );
    },
    customizeServer: async (customization: {
      colorScheme?:
        | "zinc"
        | "slate"
        | "stone"
        | "gray"
        | "neutral"
        | "red"
        | "rose"
        | "orange"
        | "green"
        | "blue"
        | "yellow"
        | "violet";
      description?: string;
      discord?: string;
      banner?: string;
    }) => {
      if (!server)
        throw new Error("Server hasn't initialized, cannot continue.");

      const response = await fetch(server?.actions.customize, {
        body: JSON.stringify({ customization }),
        method: "POST",
      });

      if (!response.ok) throw new Error("Error while customizing server.");
    },
    reportServer: async (reason: string) => {
      if (!server)
        throw new Error("Server hasn't initialized, cannot continue.");

      const response = await fetch(server.actions.report, {
        body: JSON.stringify({ reason }),
        method: "POST",
      });

      if (!response.ok)
        throw new Error(
          "Error while reporting server. Please email support@mhsf.app if reporting again breaks."
        );
    },
  };
}
