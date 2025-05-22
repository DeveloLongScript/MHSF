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

import { getBackendProcedure } from "@/lib/backend-procedure";
import type { Achievement } from "@/lib/types/achievement";
import type { ActualCustomization, MHSFData } from "@/lib/types/data";
import { clerkClient, getAuth, type User } from "@clerk/nextjs/server";
import { type Db, type Filter, type Document, MongoClient, type WithId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export type RouteParams = {
	actions: {
		favorite: string;
		customize: string;
		own: string;
		report: string;
		history: {
			dailyData: string;
			monthlyData: string;
			relativeData: string;
			historicalData: string;
		};
	};
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<
		{ server: (MHSFData & RouteParams) | null } | { error: string }
	>,
) {
	const backendProcedure = await getBackendProcedure(req);

	if (backendProcedure.status !== "OK")
		return res.status(403).json({
			error: `Backend procedure marked request as '${backendProcedure.status}' instead of required 'OK'`,
		});
	const {
		server,
		maxFavoriteEntries,
		favoriteTimespanStart,
		favoriteTimespanEnd,
		maxPlayerEntries,
		playerTimespanStart,
		playerTimespanEnd,
		maxAchievementEntries,
		achievementTimespanStart,
		achievementTimespanEnd,
	} = req.query;
	if (!server) return res.status(400).send({ server: null });

	const serverData = await findServerData(server as string);
	if (!serverData.exists) return res.status(404).send({ server: null });

	const mongo = new MongoClient(process.env.MONGO_DB as string);

	try {
		await mongo.connect();
		const db = mongo.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");
		const { userId } = getAuth(req);

		// Run queries in parallel
		const [favoriteData, customizationData, playerData, achievements] =
			await Promise.all([
				findFavoriteData(serverData.name, userId ?? undefined, db, {
					maxFavoriteEntries,
					favoriteTimespanStart,
					favoriteTimespanEnd,
				}),
				findCustomizationData(
					serverData.name,
					server as string,
					userId ?? undefined,
					db,
				),
				findPlayerData(serverData.name, db, {
					maxPlayerEntries,
					playerTimespanStart,
					playerTimespanEnd,
				}),
				findAchievements(serverData.name, db, {
					maxAchievementEntries,
					achievementTimespanStart,
					achievementTimespanEnd,
				}),
			]);

		res.send({
			server: {
				favoriteData,
				// @ts-ignore Also don't care what you think.
				customizationData,
				playerData,
				achievements,
				actions: {
					history: {
						dailyData: `/api/v1/server/get/${server}/history/daily-data`,
						monthlyData: `/api/v1/server/get/${server}/history/monthly-data`,
						relativeData: `/api/v1/server/get/${server}/history/relative-data`,
						historicalData: `/api/v1/server/get/${server}/history/historical-data`,
					},
					favorite: `/api/v1/server/get/${server}/favorite-server`,
					customize: `/api/v1/server/get/${server}/customize`,
					own: `/api/v1/server/get/${server}/own-server`,
					report: `/api/v1/server/get/${server}/report-server`,
				},
			},
		});
	} catch (error) {
		console.error("Error processing request:", error);
		res.status(500).send({ server: null });
	} finally {
		await mongo.close();
	}
}

async function findCustomizationData(
	serverName: string,
	serverId: string,
	userId: string | undefined,
	db: Db,
): Promise<{
	description: string | undefined;
	discord: string | undefined;
	colorScheme: string | undefined;
	colorMode: "dark" | "light" | null;
	customizationVersion: number | undefined;
	userProfilePicture: string | undefined;
	isOwned: boolean;
	isOwnedByUser: boolean;
	banner: string | undefined;
	_deletionId: string | undefined;
}> {
	const clerk = await clerkClient();
	// Run queries in parallel
	const [customizationData, ownedServerData] = await Promise.all([
		db
			.collection("customization")
			.findOne({ $or: [{ serverId: serverId }, { server: serverName }] }),
		userId
			? db
					.collection("owned-servers")
					.findOne({ $or: [{ serverId: serverId }, { server: serverName }] })
			: null,
	]);
	let user: User | undefined = undefined;
	if (ownedServerData) {
		try {
			user = await clerk.users.getUser(ownedServerData?.author);
		} catch (e) {
			console.warn(e);
			if (customizationData || ownedServerData) {
				const baseData: {
					description?: string;
					discord?: string;
					colorScheme?: string;
					colorMode: "dark" | "light" | null;
					customizationVersion?: number;
					banner?: string;
					_deletionId?: string | undefined;
					isOwned: boolean;
					isOwnedByUser: boolean;
					userProfilePicture: string | undefined;
				} = {
					...(customizationData as WithId<ActualCustomization> | null) ?? {},
					isOwned: true,
					isOwnedByUser: ownedServerData?.author === userId,
					userProfilePicture: undefined,
					colorMode: null,
					customizationVersion: undefined,
					_deletionId: undefined,
				};
				// @ts-ignore L
				return baseData
			}
			return {
				isOwned: false,
				isOwnedByUser: false,
				description: undefined,
				banner: undefined,
				discord: undefined,
				colorScheme: undefined,
				colorMode: null,
				customizationVersion: undefined,
				userProfilePicture: undefined,
				_deletionId: undefined,
			};
		}
	}

	if (customizationData || ownedServerData) {
		const baseData: {
			description?: string;
			discord?: string;
			colorScheme?: string;
			colorMode: "dark" | "light" | null;
			customizationVersion?: number;
			banner?: string;
			_deletionId?: string | undefined;
			isOwned: boolean;
			isOwnedByUser: boolean;
			userProfilePicture: string | undefined;
		} = {
			...(customizationData as WithId<ActualCustomization> | null) ?? {},
			isOwned: true,
			isOwnedByUser: ownedServerData?.author === userId,
			customizationVersion: customizationData === null ? 2 : customizationData?.customizationVersion,
			userProfilePicture: undefined,
			colorMode: customizationData?.colorMode === undefined ? null : customizationData?.colorMode,
			_deletionId: undefined,
		};
		// @ts-ignore L
		return {
			description: baseData.description,
			discord: baseData.discord,
			colorScheme: baseData.colorScheme,
			colorMode: baseData.colorMode,
			customizationVersion: baseData.customizationVersion,
			userProfilePicture: baseData.userProfilePicture,
			isOwned: baseData.isOwned,
			isOwnedByUser: baseData.isOwnedByUser,
			...(baseData.banner ? {
				banner: baseData.banner as string,
				_deletionId: (baseData._deletionId || "") as string,
			} : {
				banner: undefined,
			}),
		};
	}

	return {
		isOwned: false,
		isOwnedByUser: false,
		description: undefined,
		banner: undefined,
		discord: undefined,
		colorScheme: undefined,
		colorMode: null,
		customizationVersion: undefined,
		userProfilePicture: undefined,
		_deletionId: undefined,
	};
}

async function findFavoriteData(
	serverName: string,
	userId: string | undefined,
	db: Db,
	query: {
		maxFavoriteEntries?: string | string[];
		favoriteTimespanStart?: string | string[];
		favoriteTimespanEnd?: string | string[];
	},
) {
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
	db: Db,
	serverName: string,
	query: {
		maxFavoriteEntries?: string | string[];
		favoriteTimespanStart?: string | string[];
		favoriteTimespanEnd?: string | string[];
	},
): Promise<{ date: string; favorites: number }[]> {
	// Build query filter
	const filter: { server: string; date?: { $gte: Date; $lte: Date } } = { server: serverName };

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

	const results = await cursor.toArray();
	return results.map(doc => ({
		date: doc.date.toISOString(),
		favorites: doc.favorites || 0
	}));
}

export async function findServerData(
	server: string,
): Promise<{ exists: boolean; name: string }> {
	try {
		const response = await fetch(`https://api.minehut.com/server/${server}`);

		// Check if the response is ok before parsing JSON
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

async function findPlayerData(
	serverName: string,
	db: Db,
	query: {
		maxPlayerEntries?: string | string[];
		playerTimespanStart?: string | string[];
		playerTimespanEnd?: string | string[];
	},
) {
	// Get historical player data
	const historyCollection = db.collection("history");

	// Build query filter
	const filter: Filter<Document> = { server: serverName };

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
		historyCollection
			.find({ server: serverName })
			.sort({ player_count: -1 })
			.limit(1)
			.project({ player_count: 1 })
			.toArray(),

		historyCollection.find(filter).project(projection).toArray(),
	]);

	// Apply limit if specified
	let historically = playerHistory;
	if (query.maxPlayerEntries) {
		historically = historically.slice(0, Number(query.maxPlayerEntries));
	}

	// Format the data to match the expected structure
	type HistoryDocument = { date: Date; player_count?: number };
	const formattedHistory = historically.map(
		(item) => ({
			date: (item as HistoryDocument).date.toISOString(),
			playerCount: (item as HistoryDocument).player_count || 0,
		}),
	);

	const max = maxResult.length > 0 ? maxResult[0].player_count : 0;

	return { historically: formattedHistory, max };
}

async function findAchievements(
	serverName: string,
	db: Db,
	query: {
		maxAchievementEntries?: string | string[];
		achievementTimespanStart?: string | string[];
		achievementTimespanEnd?: string | string[];
	},
) {
	// Get achievements data
	const achievementsCollection = db.collection("achievements");

	// Build query filter
	const filter: Filter<Document> = { name: serverName };

	// Add date range filter if provided
	if (query.achievementTimespanStart && query.achievementTimespanEnd) {
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

	// Transform the data to match the expected shape
	const transformedHistorically = historically.map(doc => ({
		_id: doc._id.toString(),
		name: doc.name,
		achievements: doc.achievements || []
	}));

	const currently: Achievement[] = [];
	for (const a of historically)
		for (const item of a.achievements)
			currently.push(item);

	return { historically: transformedHistorically, currently };
}
