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

import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import { waitUntil } from "@vercel/functions";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { userId } = getAuth(req);

	if (!userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const client = new MongoClient(process.env.MONGO_DB as string);
	await client.connect();

	const db = client.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");
	const users = db.collection("claimed-users");
	if ((await users.find({ userId }).toArray()).length === 0) {
		res.status(400).send({ result: "Hasn't linked yet!" });
		return;
	}
	await users.findOneAndDelete({ userId });
	const user = await (await clerkClient()).users.getUser(userId);

	await (await clerkClient()).users.updateUserMetadata(userId, {
		publicMetadata: { player: null },
	});

	// Close the database, but don't close this
	// serverless instance until it happens
	waitUntil(client.close());

	res.send({ result: "Unlinked!" });
}
