import type { NextApiResponse, NextApiRequest } from "next";
import { MongoClient, ObjectId } from "mongodb";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("favorites");
  const find = await collection.find({ user: userId }).toArray();

  if (find.length == 0) {
    res.send({ result: [] });
  } else {
    res.send({ result: find[0].favorites });
  }
  client.close();
}

function checkForInfoOrLeave(res: NextApiResponse, info: any) {
  if (info == undefined)
    res.status(400).json({ message: "Information wasn't supplied" });
  return info;
}
