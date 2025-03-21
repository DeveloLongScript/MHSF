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

import { clerkClient } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";

const reportObj = (
  serverName: string,
  userId: string,
  userAvatar: string,
  username: string,
  reason: string,
  serverHasCustomizationData: boolean
) => {
  return {
    content: "<@&1283912654536314961>",
    embeds: [
      {
        title: `Report on server \`${serverName}\``,
        description: `There was a report on server \`${serverName}\` by user \`${userId}\`.`,
        color: 16759796,
        fields: [
          {
            name: "Reason",
            value: reason,
          },
          {
            name: "Server has customization data?",
            value: serverHasCustomizationData ? "Yes" : "No",
          },
        ],
        author: {
          name: username,
          url: `${process.env.CLERK_USER_PREFIX}/${userId}`,
          icon_url: userAvatar,
        },
      },
    ],
    attachments: [],
  };
};

export async function sendDiscordReport(
  serverName: string,
  userId: string,
  reason: string
) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const mongo = new MongoClient(process.env.MONGO_DB as string);
  await mongo.connect();

  const collection = mongo.db("mhsf").collection("customization");
  const server = await collection.findOne({ server: serverName });

  await fetch(process.env.DISCORD_WEBHOOK as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      reportObj(
        serverName,
        userId,
        user.imageUrl,
        user.username ?? "",
        reason,
        server !== null
      )
    ),
  });
}
