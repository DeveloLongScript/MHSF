/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.headers.Authorization !== `Bearer ${process.env.CRON_SECRET}`) {
		return res.status(401).end("Unauthorized");
	}
	const mongo = new MongoClient(process.env.MONGO_DB as string);
	const meta = mongo.db("mhsf").collection("history");
	const historical = mongo.db("mhsf").collection("historical");

	const array = await meta.find().toArray();
	const result: any = {};

	array.forEach((c) => {
		if (result[c.server] == undefined) {
			result[c.server] = {
				server: c.server,
				player_count: [c.player_count],
				favorites: [c.favorites],
				time: Date.now(),
			};
		} else {
			result[c.server] = {
				server: c.server,
				player_count: [...result[c.server]?.player_count, c.player_count],
				favorites: [...result[c.server]?.favorites, c.favorites],
				time: c.time,
			};
		}
	});

	historical.insertMany(Object.values(result));
	meta.drop();
	mongo.close();

	return res.send({
		body: "Dropped database. ",
	});
}
