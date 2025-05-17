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

import { getAuth } from "@clerk/nextjs/server";
import { createRouteHandler, createUploadthing } from "uploadthing/next-legacy";
import { UploadThingError, UTApi } from "uploadthing/server";
import { findServerData } from "..";
import { MongoClient } from "mongodb";
import type { FileRoute } from "uploadthing/types";
import type { Json } from "@uploadthing/shared";
import { checkOwnedServerMetadata } from "@/lib/check-owned-server";

const f = createUploadthing();

export default createRouteHandler({
	router: {
		imageUploader: f({
			image: {
				maxFileSize: "4MB",
				maxFileCount: 1,
			},
		})
			// Set permissions and file types for this FileRoute
			.middleware(async ({ req, res }) => {
				// Step 1: Check authentication
				const { userId } = getAuth(req);

				if (!userId) throw new UploadThingError("Unauthorized");

				// Step 2: Check server
				const { server } = req.query;
				const serverData = await findServerData(server as string);
				const mongoClient = new MongoClient(process.env.MONGO_DB as string);

				try {
					if (!serverData.exists)
						throw new UploadThingError("Server doesn't exist");
					await mongoClient.connect();

					const db = mongoClient.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");
					const ownedServer = await db
						.collection("owned-servers")
						.findOne({
							$or: [{ serverId: server }, { server: serverData.name }],
						});
					if (!ownedServer) throw new UploadThingError("Server not linked");
					if (ownedServer.author !== userId)
						throw new UploadThingError("You don't own this server.");

					return {
						userId,
						ownedServer,
						serverId: server,
						serverName: serverData.name,
					};
				} finally {
					await mongoClient.close();
				}
			})
			.onUploadComplete(async ({ metadata, file }) => {
				// This code RUNS ON YOUR SERVER after upload
				console.log("Upload complete for userId:", metadata.userId);
				console.log("file url", file.ufsUrl);
				console.log("metadata:", metadata);
                const utapi = new UTApi();

				// Step 3: Update the server's customization data with the new banner URL
				const mongoClient = new MongoClient(process.env.MONGO_DB as string);
				try {
					const { customizedServer } =
						await checkOwnedServerMetadata(metadata.userId, mongoClient, {
							id: metadata.serverId as string,
						});
					const db = mongoClient.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");

                    // Step 3.5: Delete old banner if needed
                    if (customizedServer?.banner) {
                        await utapi.deleteFiles(customizedServer._deletionId);
                    }

					// Step 4: Update or insert the customization data
					const result = await db
						.collection("customization")
						.updateOne(
							{
								$or: [
									{ serverId: metadata.serverId },
									{ server: metadata.serverName },
								],
							},
							{ $set: { banner: file.ufsUrl, customizationVersion: 2, _deletionId: file.key } },
							{ upsert: true },
						);

					console.log("Database update result:", result);

					// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
					return { uploadedBy: metadata.userId };
				} catch (error) {
					console.error("Error updating database:", error);
					throw error;
				} finally {
					await mongoClient.close();
				}
			}),
	},
});

export type BannerUploaderRouter = {
	imageUploader: FileRoute<{
		input: undefined;
		output: {
			uploadedBy: string;
		};
		errorShape: Json;
	}>;
};
