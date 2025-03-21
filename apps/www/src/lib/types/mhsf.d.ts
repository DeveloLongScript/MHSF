declare namespace MHSF {
  export type Server = {
    staticInfo: {
      _id: string;
      serverPlan: string;
      serviceStartDate: number;
      platform: string;
      planMaxPlayers: number;
      planRam: number;
      alwaysOnline: boolean;
      rawPlan: string;
      connectedServers: any[];
    };
    maxPlayers: number;
    name: string;
    motd: string;
    icon: string;
    playerData: {
      playerCount: number;
      timeNoPlayers: number;
    };
    connectable: boolean;
    visibility: boolean;
    allCategories: string[];
    usingCosmetics: boolean;
    author?: string;
    authorRank: string;
  };
} 