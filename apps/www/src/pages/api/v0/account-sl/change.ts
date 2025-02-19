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

import type { NextApiRequest, NextApiResponse } from "next";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import z from "zod";

const obj = z.object({
	// Use padding on the sides of only the servers, not the whole server list
	srv: z.boolean(),
	// Items per row (4-6 rows)
	ipr: z.number().min(4).max(6),
	// Padding of server list (0-120px)
	pad: z.number().min(0).max(120),
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { userId } = getAuth(req);

	if (!userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const { data } = req.body;

	if (data === undefined) {
		res.status(400).send({ message: "Couldn't find data" });
		return;
	}

	const v = obj.parse(data);
	for (const [key, value] of Object.entries(v)) {
		(await clerkClient()).users.updateUserMetadata(userId, {
			publicMetadata: {
				[key]: typeof value === "number" ? value.toString() : value,
			},
		});
	}

	res.status(200).send({ message: "Success" });
}
