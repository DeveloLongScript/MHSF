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

import { checkOwnedServerMetadata } from "@/lib/check-owned-server";
import { getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { server: serverId, discordServerId } = req.query;
		const mongo = new MongoClient(process.env.MONGO_DB as string);
		if (!discordServerId)
			return res.status(400).send({ error: "No description provided" });
		if (
			!(
				discordServerId.length <= 25 &&
				discordServerId.length > 3 &&
				/^\d+$/.test(discordServerId as string)
			)
		)
			return res.status(400).send({ error: "Invalid value" });

		const { ok } = await fetch(
			`https://discord.com/api/guilds/${discordServerId}/widget.json`,
		);

		if (!ok) return res.status(400).send({ error: "Invalid value" });

		const { changeServer } = await checkOwnedServerMetadata(
			getAuth(req).userId ?? null,
			mongo,
			{
				id: serverId as string,
			},
		);

		await changeServer({
			discord: discordServerId as string,
		});
	} catch (error) {
		return res.status(400).send({ error: error });
	}
	return res.send({ message: "Success" });
}
