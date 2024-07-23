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
  const server = checkForInfoOrLeave(res, req.body.server);
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("favorites");
  const find = await collection.find({ user: userId }).toArray();
  if (find.length == 0) res.send({ result: false });
  else {
    res.send({ result: find[0].favorites.includes(server) });
  }
  client.close();
}

function checkForInfoOrLeave(res: NextApiResponse, info: any) {
  if (info == undefined)
    res.status(400).json({ message: "Information wasn't supplied" });
  return info;
}
