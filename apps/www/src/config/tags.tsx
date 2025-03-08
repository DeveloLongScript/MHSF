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

import type { BadgeColor } from "@/components/feat/server-list/server-card";
import { isFavorited } from "@/lib/api";
import type { OnlineServer, ServerResponse } from "@/lib/types/mh-server";
import { Cake, ServerCog } from "lucide-react";
import type { ReactNode } from "react";

const serverCache: any = {};

// allTags object
// name: name of the tag (server) => string
// condition: what condition will the tag appear. if the primary flag is false, just use a empty function (server) => boolean
// listCondition?: if this flag isn't primary, what condition will the tag appear if the server is offline
// tooltipDesc: the tooltip text when hovered (string)
// htmlDocs: when clicked, what appears (formatted in HTML, string, using the `` string format)
// docsName: name appearing on the title in the docs. (string)
// role?: the role used on the badge (https://ui.shadcn.com/docs/components/badge + some custom others, string)
// __disab: you shouldn't mess with this flag
// __filter: if your name isn't static, set this to true
//
// You may also use `requestServer()` to grab the offline version of the server from the API, which may get you more information about the server (ServerResponse)
export const allTags: Array<{
  name: (server: {
    online?: OnlineServer;
    server?: ServerResponse;
  }) => Promise<string | ReactNode>;
  condition?: (server: {
    online?: OnlineServer;
    server?: ServerResponse;
  }) => Promise<boolean>;
  tooltipDesc: string;
  htmlDocs: string;
  docsName: string;
  role?: BadgeColor;
  __disab?: boolean;
  __filter?: boolean;
}> = [
  {
    name: async (c) => (
      <>
        <div
          className="items-center bg-green-700 dark:bg-green-400"
          style={{
            width: ".4rem",
            height: ".4rem",
            borderRadius: "9999px",
          }}
        />
        {String(
          c.online === undefined
            ? c.server?.playerCount
            : c.online.playerData.playerCount
        )}{" "}
        online
      </>
    ),
    condition: async (c) =>
      (c.online === undefined
        ? c.server?.playerCount
        : c.online.playerData.playerCount) !== 0,
    htmlDocs:
      "'Players Online' specifies the amount of players currently online. If this server is a network, the amount of players may not be accurate as this counter only counts the number of players coming directly from Minehut",
    tooltipDesc:
      "'Players Online' specifies the amount of players currently online.",

    role: "green-subtle",
    docsName: "Players Online",
    __filter: true,
  },
  {
    name: async (c) => (
      <>
        <div
          className="items-center bg-gray-700 dark:bg-gray-300"
          style={{
            width: ".4rem",
            height: ".4rem",
            borderRadius: "9999px",
          }}
        />{" "}
        0 online
      </>
    ),
    condition: async (c) =>
      (c.online === undefined ? c.server?.playerCount : c.online.playerData) ===
      0,
    htmlDocs: "Nobody is online this server.",
    tooltipDesc: "Nobody is online this server.",

    role: "gray-subtle",
    docsName: "Nobody Online",
    __filter: true,
  },
  {
    name: async () => (
      <>
        <ServerCog size={16} />
        Always Online
      </>
    ),
    condition: async (b) =>
      b.online !== undefined && b.online.staticInfo?.alwaysOnline,
    tooltipDesc:
      '"Always online" means that the server will not shut down until the plan associated with it expires.',
    htmlDocs: `
    This tag appears on servers where the plan they are under allows the server to be always online. However, if the plan associated with the tag expires, the server will no longer be Always Online. <em>This is in servers with one of the more expensive plans, or just a server that is external.</em>
    `,

    docsName: "Always Online",
    role: "blue-subtle",
    __disab: true,
  },
  {
    name: async (s) =>
      (s.online !== undefined
        ? s.online.staticInfo.planMaxPlayers
        : s.server?.maxPlayers) + " max players",
    condition: async (s) =>
      s.online !== undefined
        ? s.online.staticInfo.planMaxPlayers != null
        : s.server?.maxPlayers != null,
    tooltipDesc:
      "This tag represents the maximum amount of players the server can have at one time.",
    docsName: "Max Players",
    htmlDocs:
      "This tag represents the maximum amount of players the server can have at one time. This doesn't mean the amount of players before the server crashes, it means the amount Minehut said the server can handle or the plan the server is on. <em>However, sometimes it might not appear because the server is external.</em>",

    role: "blue",
    __filter: true,
  },
  {
    name: async () => "Partner",
    condition: async (s) =>
      (s.server ?? s.online ?? { name: "" }).name === "CoreBoxx",
    tooltipDesc: "This server is a partner with MHSF.",
    docsName: "Partner",
    htmlDocs: "This tag represents that this server is a partner with MHSF.",
    role: "rainbow",
  },
  {
    name: async (s) => (
      <span className="capitalize">
        {(s.online !== undefined
          ? s.online.staticInfo.serverPlan
          : (s.server?.server_plan ?? "")
        )
          .split(" ")[0]
          .split("_")[0]
          .toLocaleLowerCase()}
      </span>
    ),
    tooltipDesc: "This tag represents the server plan this server is using.",
    docsName: "Server Plan",
    htmlDocs:
      "This tag represents the maximum amount of players the server can have at one time. This doesn't mean the amount of players before the server crashes, it means the amount Minehut said the server can handle or the plan the server is on. <em>However, sometimes it might not appear because the server is external.</em>",

    role: "red-subtle",
    __filter: true,
  },
  {
    name: async (s) => (
      <span className="flex items-center gap-2">
        <Cake size={16} /> Created {timeConverter(s.server?.creation)}
      </span>
    ),
    condition: async (s) => s.server !== undefined,
    tooltipDesc: "This tag represents the date this server was created.",
    docsName: "Creation Date",
    htmlDocs: "This tag represents the date this server was created.",
    role: "gray",
  },
  {
    name: async (s) => "Favorited",
    condition: async (s) => {
      const favorited = await isFavorited(
        (s.online ?? s.server ?? { name: "" }).name
      );
      return favorited;
    },
    tooltipDesc: "This tag represents that you favorited this server.",
    docsName: "Favorited",
    htmlDocs:
      "This tag shows that you favorited this server in MHSF. The amount of favorites is publicly shown to other users using MHSF. We do not provide server owners with data about who favorites a server, unlike traditional voting systems.",
    role: "red",
  },
  // deprecated
  /**{
    name: async () => "Velocity",
    condition: async (s) => {
      var type = await requestServer(s);
      return type.server_version_type == "VELOCITY";
    },
    tooltipDesc:
      "This server uses Velocity, or has multiple servers inside of it",
    htmlDocs:
      'Does this server use <a href="https://papermc.io/software/velocity">Velocity</a>? This means that the server has multiple minigames/other servers gamemodes that are private, and this server is the lobby.',
    docsName: "Velocity",
    
    role: "violet",
  }, */
];

export const allCategories: Array<{
  name: string;
  condition: (server: OnlineServer) => Promise<boolean>;
  role?: BadgeColor;
}> = [
  {
    name: "Farming",
    condition: async (b: any) => {
      return b.allCategories.includes("farming");
    },

    role: "default",
  },
  {
    name: "SMP",
    condition: async (b: any) => {
      return b.allCategories.includes("smp");
    },

    role: "default",
  },
  {
    name: "Factions",
    condition: async (b: any) => {
      return b.allCategories.includes("factions");
    },

    role: "default",
  },
  {
    name: "Meme",
    condition: async (b: any) => {
      return b.allCategories.includes("meme");
    },

    role: "default",
  },
  {
    name: "Puzzle",
    condition: async (b: any) => {
      return b.allCategories.includes("puzzle");
    },

    role: "default",
  },
  {
    name: "Box",
    condition: async (b: any) => {
      return b.allCategories.includes("box");
    },

    role: "default",
  },
  {
    name: "Minigames",
    condition: async (b: any) => {
      return b.allCategories.includes("minigames");
    },

    role: "default",
  },
  {
    name: "RPG",
    condition: async (b: any) => {
      return b.allCategories.includes("rpg");
    },

    role: "default",
  },
  {
    name: "Parkour",
    condition: async (b: any) => {
      return b.allCategories.includes("parkour");
    },

    role: "default",
  },
  {
    name: "Lifesteal",
    condition: async (b: any) => {
      return b.allCategories.includes("lifesteal");
    },

    role: "default",
  },
  {
    name: "Prison",
    condition: async (b: any) => {
      return b.allCategories.includes("prison");
    },

    role: "default",
  },
  {
    name: "Gens",
    condition: async (b: any) => {
      return b.allCategories.includes("gens");
    },

    role: "default",
  },
  {
    name: "Skyblock",
    condition: async (b: any) => {
      return b.allCategories.includes("skyblock");
    },

    role: "default",
  },
  {
    name: "Roleplay",
    condition: async (b: any) => {
      return b.allCategories.includes("roleplay");
    },

    role: "default",
  },
  {
    name: "PvP",
    condition: async (b: any) => {
      return b.allCategories.includes("pvp");
    },

    role: "default",
  },
  {
    name: "Modded",
    condition: async (b: any) => {
      return b.allCategories.includes("modded");
    },

    role: "default",
  },
  {
    name: "Creative",
    condition: async (b: any) => {
      return b.allCategories.includes("creative");
    },

    role: "default",
  },
];

async function requestServer(s: OnlineServer): Promise<ServerResponse> {
  if (serverCache[s.name] === undefined) {
    const re = await fetch(
      "https://api.minehut.com/server/" + s.name + "?byName=true"
    );
    const json = await re.json();
    serverCache[s.name] = json.server;
    return json.server;
  }
  return serverCache[s.name];
}

function timeConverter(UNIX_timestamp: any) {
  const a = new Date(UNIX_timestamp);
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const time = month + "/" + date + "/" + year;
  return time;
}
