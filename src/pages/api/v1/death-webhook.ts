import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers.Authentication != process.env.WEBHOOK_AUTH) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { id } = req.body.data;
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("claimed-users");
  await collection.findOneAndDelete({ userId: id });

  res.send({ message: "Done!" });
  client.close();
}
