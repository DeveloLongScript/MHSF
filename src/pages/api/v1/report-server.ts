import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import { inngest } from "../inngest";

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
  const { reason } = req.body;

  if (reason == null) {
    res.status(400).send({ message: "Couldn't find data" });
    return;
  }

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("reports");
  const entry = await collection.insertOne({
    server: server,
    reason: reason,
    userId: userId,
  });
  // Don't wait for this to finish, just continue anyway
  inngest.send({
    name: "report-server",
    data: {
      _id: entry.insertedId.toString(),
      server,
      reason,
      userId,
    },
  });

  client.close();
  res.send({ msg: "Successfully reported server!" });
}
