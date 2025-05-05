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
    const json: DiscordUser = await response.json()
    const mongo = new MongoClient(process.env.MONGO_DB as string);
	const db = mongo.db("mhsf").collection('waitlist-approved');
	const refs = mongo.db("mhsf").collection('waitlist-refs');

    const entry = await db.findOneAndDelete({
        user: json.username
    })

    if (entry === null) {
        return res.status(400).send({message: "You are unfortunately not eligible."})
    }
    
    const rand = crypto.randomUUID();
    await refs.insertOne({
        usersRemaining: 2,
        id: rand,
        userAssociatedTo: json.username
    })

    const user = await client.users.getUser(userId);

    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            ...user.publicMetadata,
            v2allowed: true
        }
    });

    return res.send({message: "You are eligible!", refUUID: rand})
}

export interface DiscordUser {
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
    flags: number
    accent_color: number
    global_name: string
    banner_color: string
    clan: Clan
    primary_guild: PrimaryGuild
    mfa_enabled: boolean
    locale: string
    premium_type: number
    email: string
    verified: boolean
  }
  
  export interface Clan {
    identity_guild_id: string
    identity_enabled: boolean
    tag: string
    badge: string
  }
  
  export interface PrimaryGuild {
    identity_guild_id: string
    identity_enabled: boolean
    tag: string
    badge: string
  }
  