import { OnlineServer, ServerResponse } from "@/lib/types/mh-server";

const serverCache: any = {};

// allTags object
// name: name of the tag (server) => string
// condition: what condition will the tag appear. if the primary flag is false, just use a empty function (server) => boolean
// listCondition?: if this flag isn't primary, what condition will the tag appear if the server is offline
// tooltipDesc: the tooltip text when hovered (string)
// htmlDocs: when clicked, what appears (formatted in HTML, string, using the `` string format)
// docsName: name appearing on the title in the docs. (string)
// role?: the role used on the badge (https://ui.shadcn.com/docs/components/badge + some custom others, string)
// primary: does this tag appear **just** in the home screen (true), or **just** inside the server screen (false)
// __disab: you shouldn't mess with this flag
// __filter: if your name isn't static, set this to true
//
// You may also use `requestServer()` to grab the offline version of the server from the API, which may get you more information about the server (ServerResponse)
export var allTags: Array<{
  name: (server: OnlineServer) => Promise<string>;
  condition: (server: OnlineServer) => Promise<boolean>;
  listCondition?: (server: ServerResponse) => Promise<boolean>;
  tooltipDesc: string;
  htmlDocs: string;
  docsName: string;
  primary: boolean;
  role?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "lime"
    | "blue"
    | "teal"
    | "cyan"
    | "violet"
    | "indigo"
    | "purple"
    | "fuchsia"
    | "pink";
  __disab?: boolean;
  __filter?: boolean;
}> = [
  {
    name: async () => "Always Online",
    condition: async (b: any) => b.staticInfo.alwaysOnline,
    tooltipDesc:
      '"Always online" means that the server will not shut down until the plan associated with it expires.',
    htmlDocs: `
    This tag appears on servers where the plan they are under allows the server to be always online. However, if the plan associated with the tag expires, the server will no longer be Always Online. <em>This is in servers with one of the more expensive plans, or just a server that is external.</em>
    `,
    primary: true,
    docsName: "Always Online",
    role: "secondary",
    __disab: true,
  },
  {
    name: async (s) => s.staticInfo.planMaxPlayers + " max players",
    condition: async (s) => s.staticInfo.planMaxPlayers != null,
    tooltipDesc:
      "This tag represents the maximum amount of players the server can have at one time.",
    docsName: "Max Players",
    htmlDocs:
      "This tag represents the maximum amount of players the server can have at one time. This doesn't mean the amount of players before the server crashes, it means the amount Minehut said the server can handle or the plan the server is on. <em>However, sometimes it might not appear because the server is external.</em>",
    primary: true,
    role: "secondary",
    __filter: true,
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
    primary: true,
    role: "violet",
  }, */
];

export var allCategories: Array<{
  name: string;
  condition: (server: OnlineServer) => Promise<boolean>;
  primary: boolean;
  role?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "lime"
    | "blue"
    | "teal"
    | "cyan"
    | "violet"
    | "indigo"
    | "purple"
    | "fuchsia"
    | "pink";
}> = [
  {
    name: "Farming",
    condition: async (b: any) => {
      return b.allCategories.includes("farming");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "SMP",
    condition: async (b: any) => {
      return b.allCategories.includes("smp");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Factions",
    condition: async (b: any) => {
      return b.allCategories.includes("factions");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Meme",
    condition: async (b: any) => {
      return b.allCategories.includes("meme");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Puzzle",
    condition: async (b: any) => {
      return b.allCategories.includes("puzzle");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Box",
    condition: async (b: any) => {
      return b.allCategories.includes("box");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Minigames",
    condition: async (b: any) => {
      return b.allCategories.includes("minigames");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "RPG",
    condition: async (b: any) => {
      return b.allCategories.includes("rpg");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Parkour",
    condition: async (b: any) => {
      return b.allCategories.includes("parkour");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Lifesteal",
    condition: async (b: any) => {
      return b.allCategories.includes("lifesteal");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Prison",
    condition: async (b: any) => {
      return b.allCategories.includes("prison");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Gens",
    condition: async (b: any) => {
      return b.allCategories.includes("gens");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Skyblock",
    condition: async (b: any) => {
      return b.allCategories.includes("skyblock");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Roleplay",
    condition: async (b: any) => {
      return b.allCategories.includes("roleplay");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "PvP",
    condition: async (b: any) => {
      return b.allCategories.includes("pvp");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Modded",
    condition: async (b: any) => {
      return b.allCategories.includes("modded");
    },
    primary: true,
    role: "secondary",
  },
  {
    name: "Creative",
    condition: async (b: any) => {
      return b.allCategories.includes("creative");
    },
    primary: true,
    role: "secondary",
  },
];

async function requestServer(s: OnlineServer): Promise<ServerResponse> {
  if (serverCache[s.name] == undefined) {
    const re = await fetch(
      "https://api.minehut.com/server/" + s.name + "?byName=true"
    );
    const json = await re.json();
    serverCache[s.name] = json.server;
    return json.server;
  } else {
    return serverCache[s.name];
  }
}
