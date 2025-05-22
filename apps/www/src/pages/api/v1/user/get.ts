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

import type { MHSFUser } from "@/lib/hooks/use-user";
import { getAuth } from "@clerk/nextjs/server";
import { MongoClient, type WithId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<MHSFUser | { error: string }>,
) {
	const { userId } = getAuth(req);

	if (!userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const client = new MongoClient(process.env.MONGO_DB as string);
	await client.connect();
	const db = client.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");

	const favoriteCollection = db.collection("favorites");
	const favorites = (await favoriteCollection.findOne({
		user: userId,
	})) as WithId<{ user: string; favorites: string[] }> | null;

	const ownedServersCollection = db.collection("owned-servers");
	const ownedServers = (await ownedServersCollection
		.find({ author: userId })
		.toArray()) as WithId<{
		serverId: string;
		author: string;
		server: string;
	}>[];

	const claimedUsers = db.collection("claimed-users");
	const claimedUser = await claimedUsers.findOne({ userId });

	let uuid = "";

	if (claimedUser?.player !== undefined)
		uuid = await fetch(
			`https://api.mojang.com/users/profiles/minecraft/${claimedUser?.player ?? ""}`,
		)
			.then((c) => c.json())
			.then((d) => d.id);

	return res.send({
		favorites,
		ownedServers,
		claimedUser:
			claimedUser === null
				? null
				: { name: (claimedUser ?? { player: undefined }).player, uuid },
		actions: {
			unlinkAccount: "/api/v1/user/unlink-account",
			linkAccount: "/api/v1/user/claim-account-code",
		},
	});
}
