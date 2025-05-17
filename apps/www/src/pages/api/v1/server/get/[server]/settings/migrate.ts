import { checkOwnedServerMetadata } from "@/lib/check-owned-server";
import { getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { UTApi } from "uploadthing/server";
import type { ActualCustomization } from "@/lib/types/data";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { server: serverId } = req.query;
		const mongo = new MongoClient(process.env.MONGO_DB as string);

		const { ownedServer, customizedServer, changeServer } =
			await checkOwnedServerMetadata(getAuth(req).userId ?? null, mongo, {
				id: serverId as string,
			});

		if (customizedServer?.customizationVersion !== 2) {
			if ((!customizedServer?.banner?.startsWith("https://exh89c9lva.ufs.sh")) && customizedServer?.banner) { 
				const utapi = new UTApi();
                console.log(
					`https://wsrv.nl/?url=${encodeURIComponent(customizedServer?.banner as string)}`)
				const newBanner = await utapi.uploadFilesFromUrl(
					`https://wsrv.nl/?url=${encodeURIComponent(customizedServer?.banner as string)}`,
				);

				if (newBanner.error)
					return res.status(400).send({ error: newBanner.error });

				await changeServer({ banner: newBanner.data.ufsUrl });
			}
			await changeServer({
				colorMode: "light",
				customizationVersion: 2,
				serverId: serverId as string,
			});

			return res.send({ message: "Successfully migrated from svc1 to svc2." });
		}
		return res.send({ message: "Already migrated." });
	} catch (e) {
		res.status(400).send({ error: e });
	}
}
