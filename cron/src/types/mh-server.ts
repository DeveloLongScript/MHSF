export interface ServerResponse {
  __unix?: string;
  deletion?: Deletion;
  _id: string;
  categories: string[];
  inheritedCategories: any[];
  purchased_icons: string[];
  backup_slots: number;
  suspended: boolean;
  server_version_type: string;
  proxy: boolean;
  connectedServers: any[];
  motd: string;
  visibility: boolean;
  server_plan: string;
  storage_node: string;
  default_banner_image: string;
  default_banner_tint: string;
  owner: string;
  name: string;
  name_lower: string;
  creation: number;
  platform: string;
  credits_per_day: number;
  in_game: boolean;
  using_cosmetics: boolean;
  __v: number;
  port: number;
  last_online: number;
  joins: number;
  active_icon: string;
  expired: boolean;
  icon: string;
  online: boolean;
  maxPlayers: number;
  playerCount: number;
  rawPlan: string;
  activeServerPlan: string;
}

export interface Deletion {
  started: boolean;
  started_at: number;
  reason: string;
  completed: boolean;
  completed_at: number;
  storage_completed: boolean;
  storage_completed_at: number;
}

export interface OnlineServer {
  staticInfo: StaticInfo;
  maxPlayers: number;
  name: string;
  motd: string;
  icon: string;
  playerData: PlayerData;
  connectable: boolean;
  visibility: boolean;
  allCategories: string[];
  usingCosmetics: boolean;
  author?: string;
  authorRank: string;
}

export interface StaticInfo {
  _id: string;
  serverPlan: string;
  serviceStartDate: number;
  platform: string;
  planMaxPlayers: number;
  planRam: number;
  alwaysOnline: boolean;
  rawPlan: string;
  connectedServers: any[];
}

export interface PlayerData {
  playerCount: number;
  timeNoPlayers: number;
}

export interface OnlineServerExtended extends OnlineServer {
  favorites: number;
  position: {
    joins: number;
    favorites?: number;
  };
}