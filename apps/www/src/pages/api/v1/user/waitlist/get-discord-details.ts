import { clerkClient, getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { userId } = getAuth(req);
	if (!userId) {
		return res.json({ message: "User not found" });
	}

	// Get the OAuth access token for the user
	const provider = "discord";

	const client = await clerkClient();

	const clerkResponse = await client.users.getUserOauthAccessToken(
		userId,
		provider,
	);

	const accessToken = clerkResponse.data[0]?.token || "";

	if (!accessToken) {
		return res.status(401).json({ message: "Access token not found" });
	}

	const response = await fetch("https://discord.com/api/users/@me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
    const json = await response.json()

	res.send({ discordData: json });
    
}
