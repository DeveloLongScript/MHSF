import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { server } = req.body;

  if (server == null) {
    res.status(400).send({ message: "Couldn't find data" });
    return;
  }

  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("owned-servers");

  res.send({ owned: (await collection.findOne({ server })) != undefined });

  client.close();
}
