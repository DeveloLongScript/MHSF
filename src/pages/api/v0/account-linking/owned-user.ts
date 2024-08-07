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

  res.send({
    result: (await collection.findOne({ server, author: userId })) != null,
  });

  client.close();
}
