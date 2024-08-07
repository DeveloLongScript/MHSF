import { NextApiRequest, NextApiResponse } from "next";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import ServersList from "@/lib/list";
import { OnlineServer } from "@/lib/types/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { server } = req.body;

  if (server == null) {
    res.status(400).send({ message: "Couldn't find data" });
    return;
  }

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (
    (await clerkClient.users.getUser(userId)).publicMetadata.player == undefined
  ) {
    return res.status(401).json({ error: "Account not linked" });
  }
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("owned-servers");

  if ((await collection.findOne({ server: server })) == undefined) {
    const mh = await fetch("https://api.minehut.com/servers", {
      headers: {
        accept: "*/*",
        "accept-language": Math.random().toString(),
        priority: "u=1, i",
        "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        Referer: "http://localhost:3000/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    });
    const servers: Array<OnlineServer> = (await mh.json()).servers;

    servers.forEach(async (c, i) => {
      if (c.name == server) {
        const MCUsername = (await clerkClient.users.getUser(userId))
          .publicMetadata.player;

        if (MCUsername == c.author) {
          await collection.insertOne({ server, author: userId });
          res.send({ message: "Successfully owned server!" });
          client.close();
        } else {
          res
            .status(400)
            .send({ message: "The linked account doesn't own the server." });
          client.close();
        }
      }
      if (i == servers.length) {
        res.status(400).send({ message: "The server needs to be online." });
        client.close();
      }
    });
  } else {
    res.status(400).send({ message: "This server has already been owned." });
    client.close();
  }
}
