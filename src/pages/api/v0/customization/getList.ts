import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { server }: { server: Array<string> | undefined } = req.body;

  if (server == null) {
    res.status(400).send({ message: "Couldn't find data" });
    return;
  }
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("customization");
  const results: { server: string; customization: any }[] = [];

  server.forEach(async (c) => {
    results.push({ server: c, customization: await collection.findOne({ c }) });
  });

  res.send({ results });

  client.close();
}
