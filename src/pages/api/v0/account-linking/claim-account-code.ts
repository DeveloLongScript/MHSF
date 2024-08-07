import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { MongoClient, ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { code } = req.body;

  if (code == null) {
    res.status(400).send({ message: "Couldn't find data" });
    return;
  }

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("auth_codes");

  const entry = await collection.findOne({ code });
  if (entry == null) {
    res.status(400).send({ message: "Couldn't find code" });
    return;
  }
  collection.findOneAndDelete({ code });
  const users = db.collection("claimed-users");
  await users.insertOne({ player: entry.player, userId });

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      player: entry.player,
    },
  });

  res.send({ player: entry.player });

  client.close();
}
