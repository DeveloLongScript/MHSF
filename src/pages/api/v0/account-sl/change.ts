import type { NextApiRequest, NextApiResponse } from "next";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

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
	const { type } = req.body;

	if (type === undefined) {
		res.status(400).send({ message: "Couldn't find data" });
		return;
	}
	if (data === null) {
		clerkClient.users.updateUserMetadata(userId, {
			publicMetadata: { [type]: null },
		});
		res.status(200).send({ message: "Success" });
	}
	if (type !== "srv" && type !== "ipr" && type !== "pad")
		return res.status(400).send({ message: "Couldn't find data" });

	if (type === "srv" && typeof data !== "boolean")
		return res.status(400).send({ message: "Couldn't find data" });

	if (type === "ipr" && typeof data !== "number")
		return res.status(400).send({ message: "Couldn't find data" });

	if (type === "pad" && typeof data !== "number")
		return res.status(400).send({ message: "Couldn't find data" });

	clerkClient.users.updateUserMetadata(userId, {
		publicMetadata: { [type]: typeof data === "number" ? data.toString() : data },
	});
	res.status(200).send({ message: "Success" });
}
