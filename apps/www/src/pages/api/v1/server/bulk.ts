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

import type { MHSFData } from "@/lib/types/data";
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

// Type definitions for query parameters
type QueryParams = {
  maxFavoriteEntries?: string | string[];
  favoriteTimespanStart?: string | string[];
  favoriteTimespanEnd?: string | string[];
  maxPlayerEntries?: string | string[];
  playerTimespanStart?: string | string[];
  playerTimespanEnd?: string | string[];
  maxAchievementEntries?: string | string[];
  achievementTimespanStart?: string | string[];
  achievementTimespanEnd?: string | string[];
};

// Type for customization data
type CustomizationData = {
  description: string | undefined;
  banner: string | undefined;
  discord: string | undefined;
  colorScheme: string | undefined;
  userProfilePicture: string | undefined;
  isOwned: boolean;
  isOwnedByUser: boolean;
};

// Type for favorite data
type FavoriteData = {
  favoritedByAccount: boolean | null;
  favoriteNumber: number;
  favoriteHistoricalData: any[];
};

// Type for player data
type PlayerData = {
  historically: { date: string; playerCount: number }[];
  max: number;
};

// Type for achievements data
type AchievementsData = {
  historically: any[];
  currently: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ servers: Record<string, MHSFData | null> }>
) {
  // Only accept POST requests with server list in the body
  if (req.method !== "POST") {
    return res.status(405).json({ servers: {} });
  }

  // Get the list of servers from the request body
  const { servers, options } = req.body;

  if (!servers || !Array.isArray(servers) || servers.length === 0) {
    return res.status(400).json({ servers: {} });
  }

  // Limit the number of servers to prevent abuse (max 25 servers per request)
  const serverList = servers.slice(0, 25);

  // Extract query parameters
  const queryOptions: QueryParams = {
    maxFavoriteEntries: req.query.maxFavoriteEntries,
    favoriteTimespanStart: req.query.favoriteTimespanStart,
    favoriteTimespanEnd: req.query.favoriteTimespanEnd,
    maxPlayerEntries: req.query.maxPlayerEntries,
    playerTimespanStart: req.query.playerTimespanStart,
    playerTimespanEnd: req.query.playerTimespanEnd,
    maxAchievementEntries: req.query.maxAchievementEntries,
    achievementTimespanStart: req.query.achievementTimespanStart,
    achievementTimespanEnd: req.query.achievementTimespanEnd,
  };

  // Determine which data to fetch based on options
  const fetchOptions = {
    favorites: options?.favorites !== false,
    customization: options?.customization !== false,
    players: options?.players !== false,
    achievements: options?.achievements !== false,
  };

  const mongo = new MongoClient(process.env.MONGO_DB as string);
  const result: Record<string, MHSFData | null> = {};

  try {
    await mongo.connect();
    const db = mongo.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");
    const userId = req.cookies.userId;

    // Process each server in parallel
    await Promise.all(
      serverList.map(async (server: string) => {
        try {
          // Verify server exists
          const serverData = await findServerData(server);
          if (!serverData.exists) {
            result[server] = null;
            return;
          }

          // Prepare promises array based on fetch options
          const promises: Promise<any>[] = [];
          const promiseResults: Record<string, any> = {};

          if (fetchOptions.favorites) {
            promises.push(
              findFavoriteData(serverData.name, userId, db, queryOptions).then(
                (data: FavoriteData) => {
                  promiseResults.favoriteData = data;
                }
              )
            );
          }

          if (fetchOptions.customization) {
            promises.push(
              findCustomizationData(serverData.name, userId, db).then(
                (data: CustomizationData) => {
                  promiseResults.customizationData = data;
                }
              )
            );
          }

          if (fetchOptions.players) {
            promises.push(
              findPlayerData(serverData.name, db, queryOptions).then(
                (data: PlayerData) => {
                  promiseResults.playerData = data;
                }
              )
            );
          }

          if (fetchOptions.achievements) {
            promises.push(
              findAchievements(serverData.name, db, queryOptions).then(
                (data: AchievementsData) => {
                  promiseResults.achievements = data;
                }
              )
            );
          }

          // Wait for all promises to resolve
          await Promise.all(promises);

          // Create default values for any missing data
          const serverResult: MHSFData = {
            favoriteData: promiseResults.favoriteData || {
              favoritedByAccount: null,
              favoriteNumber: 0,
              favoriteHistoricalData: [],
            },
            customizationData: promiseResults.customizationData || {
              description: undefined,
              banner: undefined,
              discord: undefined,
              colorScheme: undefined,
              userProfilePicture: undefined,
              isOwned: false,
              isOwnedByUser: false,
            },
            playerData: promiseResults.playerData || {
              historically: [],
              max: 0,
            },
            achievements: promiseResults.achievements || {
              historically: [],
              currently: [],
            },
          };

          result[server] = serverResult;
        } catch (error) {
          console.error(`Error processing server ${server}:`, error);
          result[server] = null;
        }
      })
    );

    res.status(200).json({ servers: result });
  } catch (error) {
    console.error("Error processing bulk request:", error);
    res.status(500).json({ servers: {} });
  } finally {
    await mongo.close();
  }
}

// Helper functions
async function findServerData(
  server: string
): Promise<{ exists: boolean; name: string }> {
  try {
    const response = await fetch("https://api.minehut.com/server/" + server);

    if (!response.ok) {
      return { exists: false, name: "" };
    }

    const serverJSON = await response.json();
    if (!serverJSON.server) return { exists: false, name: "" };

    return { exists: true, name: serverJSON.server.name };
  } catch (error) {
    console.error("Error fetching server data:", error);
    return { exists: false, name: "" };
  }
}

async function findCustomizationData(
  serverName: string,
  userId: string | undefined,
  db: any
): Promise<CustomizationData> {
  // Run queries in parallel
  const [customizationData, ownedServerData] = await Promise.all([
    db.collection("customization").findOne({ server: serverName }),
    userId
      ? db.collection("owned-servers").findOne({ server: serverName })
      : null,
  ]);

  if (customizationData) {
    return {
      ...(customizationData as any),
      isOwned: true,
      isOwnedByUser: ownedServerData?.author === userId,
    };
  }

  return {
    isOwned: false,
    isOwnedByUser: false,
    description: undefined,
    banner: undefined,
    discord: undefined,
    colorScheme: undefined,
    userProfilePicture: undefined,
  };
}

async function findFavoriteData(
  serverName: string,
  userId: string | undefined,
  db: any,
  query: QueryParams
): Promise<FavoriteData> {
  // Run queries in parallel
  const [userFavorites, metaData, historyData] = await Promise.all([
    userId ? db.collection("favorites").findOne({ user: userId }) : null,
    db.collection("meta").findOne({ server: serverName }),
    fetchHistoryData(db, serverName, query),
  ]);

  // Process user favorites
  const favoritedByAccount =
    userId && userFavorites
      ? userFavorites.favorites.includes(serverName)
      : null;

  // Process favorite count
  const favoriteNumber = metaData?.favorites || 0;

  return {
    favoritedByAccount,
    favoriteNumber,
    favoriteHistoricalData: historyData,
  };
}

async function fetchHistoryData(
  db: any,
  serverName: string,
  query: QueryParams
): Promise<any[]> {
  // Build query filter
  const filter: any = { server: serverName };

  // Add date range filter if provided
  if (query.favoriteTimespanStart && query.favoriteTimespanEnd) {
    filter.date = {
      $gte: new Date(Number(query.favoriteTimespanStart)),
      $lte: new Date(Number(query.favoriteTimespanEnd)),
    };
  }

  // Determine limit
  const limit = query.maxFavoriteEntries ? Number(query.maxFavoriteEntries) : 0;

  // Use projection to only fetch needed fields
  const projection = { favorites: 1, date: 1, _id: 0 };

  // Execute optimized query
  const cursor = db.collection("history").find(filter).project(projection);

  // Apply limit if specified
  if (limit > 0) {
    cursor.limit(limit);
  }

  return await cursor.toArray();
}

async function findPlayerData(
  serverName: string,
  db: any,
  query: QueryParams
): Promise<PlayerData> {
  // Build query filter
  const filter: any = { server: serverName };

  // Add date range filter if provided
  if (query.playerTimespanStart && query.playerTimespanEnd) {
    filter.date = {
      $gte: new Date(Number(query.playerTimespanStart)),
      $lte: new Date(Number(query.playerTimespanEnd)),
    };
  }

  // Use projection to only fetch needed fields
  const projection = { player_count: 1, date: 1, _id: 0 };

  // Get max player count in a single query
  const [maxResult, playerHistory] = await Promise.all([
    db
      .collection("history")
      .find({ server: serverName })
      .sort({ player_count: -1 })
      .limit(1)
      .project({ player_count: 1 })
      .toArray(),

    db.collection("history").find(filter).project(projection).toArray(),
  ]);

  // Apply limit if specified
  let historically = playerHistory;
  if (query.maxPlayerEntries) {
    historically = historically.slice(0, Number(query.maxPlayerEntries));
  }

  // Format the data to match the expected structure
  const formattedHistory = historically.map(
    (item: { date: string; player_count?: number }) => ({
      date: item.date,
      playerCount: item.player_count || 0,
    })
  );

  const max = maxResult.length > 0 ? maxResult[0].player_count : 0;

  return { historically: formattedHistory, max };
}

async function findAchievements(
  serverName: string,
  db: any,
  query: QueryParams
): Promise<AchievementsData> {
  // Get achievements data
  const achievementsCollection = db.collection("achievements");

  // Build query filter
  const filter: any = { name: serverName };

  // Add date range filter if provided
  if (query.achievementTimespanStart && query.achievementTimespanEnd) {
    // Assuming there's a timestamp or date field in the achievements collection
    filter.timestamp = {
      $gte: new Date(Number(query.achievementTimespanStart)),
      $lte: new Date(Number(query.achievementTimespanEnd)),
    };
  }

  // Get historical achievements
  let historically = await achievementsCollection.find(filter).toArray();

  // Apply limit if specified
  if (query.maxAchievementEntries) {
    historically = historically.slice(0, Number(query.maxAchievementEntries));
  }

  const currently: any[] = [];
  for (const a of historically)
    a.achievements.forEach((item: any, interval: number) =>
      currently.push({ interval, ...item })
    );

  return { historically, currently };
}
