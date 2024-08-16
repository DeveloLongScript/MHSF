import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("meta");

  const all = await collection.find().toArray();
  const sorted = all.sort((a, b) => a.favorites - b.favorites);
  sorted.reverse();
  res.send({ results: sorted });

  client.close();
}
