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
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import { OnlineServer } from "@/lib/types/mh-server";
import { waitUntil } from "@vercel/functions";
import { getBackendProcedure } from "@/lib/backend-procedure";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const backendProcedure = await getBackendProcedure(req);

	if (backendProcedure.status !== "OK")
		return res.status(403).json({
			error: `Backend procedure marked request as '${backendProcedure.status}' instead of required 'OK'`,
		});
	const { userId } = getAuth(req);
	const { server } = req.query;

	if (server == null) {
		res.status(400).send({ message: "Couldn't find data" });
		return;
	}

	if (!userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const client = new MongoClient(process.env.MONGO_DB as string);
	await client.connect();

	const db = client.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");
	const collection = db.collection("owned-servers");
	const users = db.collection("claimed-users");

	if ((await users.findOne({ userId })) === null) {
		return res.status(401).json({ error: "Account not linked" });
	}

	const minecraftUsername = (await users.findOne({ userId }))?.player;

	if ((await collection.findOne({ server })) === null) {
		const mh = await fetch(
			process.env.MHSF_BACKEND_API_LOCATION ??
				"https://api.minehut.com/servers",
			{
				headers: {
					accept: "*/*",
					"accept-language": Math.random().toString(),
					priority: "u=1, i",
					"sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126"',
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": '"macOS"',
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "cross-site",
					Referer: "http://localhost:3000/",
					"Referrer-Policy": "strict-origin-when-cross-origin",
					Authentication: `MHSF-Backend-Server ${process.env.MHSF_BACKEND_API_LOCATION ? process.env.MHSF_BACKEND_SECRET : "Sorry Minehut Devs."}`,
				},
				body: null,
				method: "GET",
			},
		);
		const servers: Array<OnlineServer> = (await mh.json()).servers;
		const serverObj = servers.find((c) => c.staticInfo._id === server);

		if (serverObj === undefined)
			return res
				.status(400)
				.send({ message: "The server needs to be online." });

		if (minecraftUsername === serverObj.author) {
			await collection.insertOne({ server, author: userId });

			// Close the database, but don't close this
			// serverless instance until it happens
			waitUntil(client.close());

			res.send({ message: "Successfully owned server!" });
		} else {
			res
				.status(400)
				.send({ message: "The linked account doesn't own the server." });
		}
	} else {
		// Close the database, but don't close this
		// serverless instance until it happens
		waitUntil(client.close());

		res.status(400).send({ message: "This server has already been owned." });
	}
}
