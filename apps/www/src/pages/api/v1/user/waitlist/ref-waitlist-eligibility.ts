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

import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const client = await clerkClient();
	const { userId } = getAuth(req);
	if (!userId) {
		return res.status(400).json({ message: "User not found" });
	}

	const user = await client.users.getUser(userId);
	if (user.publicMetadata.v2allowed === true) {
		return res.status(400).json({ message: "v2 already allowed." });
	}

	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ message: "ID not specified" });
	}

	const uuidTested =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
			id,
		);
	if (uuidTested === false)
		return res.status(400).json({ message: "UUID not valid" });

	const mongo = new MongoClient(process.env.MONGO_DB as string);
	const refs = mongo.db("mhsf").collection("waitlist-refs");

	const ref = await refs.findOne({
		id,
	});
	if (ref !== undefined && ref !== null) {
		if (ref.usersRemaining !== 0) {
			await refs.findOneAndUpdate(
				{
					id,
				},
				{
					$inc: { usersRemaining: -1 },
				},
			);

			await client.users.updateUserMetadata(userId, {
				publicMetadata: {
					...user.publicMetadata,
					v2allowed: true,
				},
			});

			return res.send({ message: "You are eligible!" });
		}
		return res.status(400).json({ message: "No users left" });	
	}
	return res.status(400).json({ message: "Unknown ID" });
	
}
