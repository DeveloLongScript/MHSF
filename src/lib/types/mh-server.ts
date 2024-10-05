/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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
