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

import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { waitUntil } from "@vercel/functions";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const client = new MongoClient(process.env.MONGO_DB as string);
	const db = client.db("mhsf").collection("history");
	const server = req.query.server as string;

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const result = await Promise.all(
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(async (c) => {
			const results = await db
				.find({
					$and: [
						{ server },
						{
							date: {
								$gte: new Date(new Date().getFullYear(), c - 1, 1),
								$lt: new Date(new Date().getFullYear(), c, 1),
							},
						},
					],
				})
				.toArray();

			if (results.length !== 0) {
				const averageNums = (results as any as { player_count: number }[]).map(
					(x: { player_count: number }) => x.player_count,
				);
				const average =
					averageNums.reduce((sum, val) => sum + val, 0) / averageNums.length;

				return { month: months[c - 1], result: Math.floor(average) };
			}
			return undefined;
		}),
	);

	// Close the database, but don't close this
	// serverless instance until it happens
	waitUntil(client.close());
	res.send({ result: result.filter((c) => c !== undefined) });
}
