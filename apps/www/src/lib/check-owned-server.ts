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

import { findServerData } from "@/pages/api/v1/server/get/[server]";
import { MongoClient, type WithId } from "mongodb";
import { ActualCustomization } from "./types/data";

type ServerMetadata = {
	ownedServer: WithId<{
		/** Legacy */
		server?: string;
		/** @deprecated Use `serverId` for better identification */
		serverId?: string;
		userId: string;
	}>;
	customizedServer: WithId<
		ActualCustomization & {
			serverId?: string;
			/** @deprecated Use `serverId` for better identification */
			server?: string;
		}
	> | null;
};
type ServerMetadataFunctional = ServerMetadata & {
	changeServer: (
		changes: Partial<
			ActualCustomization & {
				serverId?: string;
				/** @deprecated Use `serverId` for better identification */
				server?: string;
			}
		>,
	) => Promise<void> | void;
};

export async function checkOwnedServerMetadata(
	userId: string | null,
	mongoClient: MongoClient,
	serverSelector: { id: string; name?: string },
): Promise<ServerMetadataFunctional> {
	// Step 1: Check auth
	if (!userId) throw new Error("Unauthorized");
	mongoClient.connect();

	// Step 2: Check server
	const serverData = await findServerData(serverSelector.id as string);

	if (!serverData.exists) throw new Error("Server doesn't exist");

	const db = mongoClient.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");
	const ownedServer = (await db.collection("owned-servers").findOne({
		$or: [
			{ serverId: serverSelector.id },
			{ server: serverSelector.name ?? serverData.name },
		],
	})) as WithId<{
		server?: string;
		serverId?: string;
		userId: string;
		author: string;
	}>;
	if (!ownedServer) throw new Error("Server not linked");
	if (ownedServer.author !== userId)
		throw new Error("You don't own this server.");

	const customizedServer = (await db.collection("customization").findOne({
		$or: [
			{ serverId: serverSelector.id },
			{ server: serverSelector.name ?? serverData.name },
		],
	})) as WithId<
		ActualCustomization & { serverId?: string; server?: string }
	> | null;

	return {
		ownedServer,
		customizedServer,
		changeServer: async (changes) => {
			await db.collection("customization").updateOne(
				{
					$or: [
						{ serverId: serverSelector.id },
						{ server: serverSelector.name ?? serverData.name },
					],
				},
				{ $set: { serverId: serverSelector.id, customizationVersion: 2, ...changes } },
				{ upsert: true },
			);
		},
	};
}
