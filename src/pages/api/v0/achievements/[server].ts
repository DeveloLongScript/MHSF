import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { server } = req.query;
  if (!server) return res.status(400).send({ error: "No server was provided" });
  
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("achievements");

  res.send({ result: await collection.find({ name: server }).toArray() });
}
