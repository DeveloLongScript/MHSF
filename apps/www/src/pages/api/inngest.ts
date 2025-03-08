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

import type { OnlineServer } from "@/lib/types/mh-server";
import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { MongoClient } from "mongodb";
import { createReportIssue } from "@/lib/linear";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "mhsf" });

// Create an API that serves zero (not zero, silly) functions
export default serve({
	client: inngest,
	functions: [
		inngest.createFunction(
			{ id: "report" },
			{ event: "report-server" },
			async ({ event, step }) => {
				// by the way, I bombed the Discord stuff
				await createReportIssue(
					event.data.server,
					event.data.reason,
					event.data.userId,
				);

				return { event, body: "Done" };
			},
		),
		inngest.createFunction(
			{ id: "short-term-data" },
			[{ cron: "*/30 * * * *" }, { event: "test/30-min" }],
			async ({ event, step }) => {
				const mongo = new MongoClient(process.env.MONGO_DB as string);
				try {
					const mh = await step.run("grab-servers-from-api", async () => {
						return await (
							await fetch("https://api.minehut.com/servers", {
								headers: {
									accept: "application/json",
									"accept-language": Math.random().toString(),
									priority: "u=1, i",
									"sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126"',
									"sec-ch-ua-mobile": "?0",
									"sec-ch-ua-platform": '"macOS"',
									"sec-fetch-dest": "empty",
									"sec-fetch-mode": "cors",
									"sec-fetch-site": "cross-site",
									"Content-Type": "application/json",
									// They'll never know hehehehehe
									Referer: "http://localhost:3000/",
									"Referrer-Policy": "strict-origin-when-cross-origin",
								},
								body: null,
								method: "GET",
							})
						).json();
					});

					const mha = mongo.db("mhsf").collection("mh");
					const meta = mongo.db("mhsf").collection("meta");
					const dbl = mongo.db("mhsf").collection("history");

					await mha.insertOne({
						total_players: mh.total_players,
						total_servers: mh.total_servers,
						date: new Date(),
					});

					const completed = await step.run("listing-servers", async () => {
						mh.servers.forEach(async (server: OnlineServer, i: number) => {
							const serverFavoritesObject = await meta.findOne({
								server: server.name,
							});
							let favorites = 0;
							if (serverFavoritesObject != undefined)
								favorites = serverFavoritesObject.favorites;

							await dbl.insertOne({
								player_count: server.playerData.playerCount,
								favorites,
								server: server.name,
								date: new Date(),
							});
							console.log(i, mh.servers.length);
						});
						return true;
					});
					if (completed == true) {
						return { event, body: "Finished!" };
					}
				} catch (e) {
					await mongo.close();

					return { event, body: "Cloudflare.. aborting " + e };
				}
			},
		),
	],
});
