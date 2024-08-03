import type { NextApiResponse, NextApiRequest } from "next";
import { MongoClient, ObjectId } from "mongodb";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { server } = req.query;
  const client = new MongoClient(process.env.MONGO_DB as string);

  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("meta");
  const find = await collection.find({ server: server }).toArray();

  if (find.length != 0) {
    const entry = find[0];
    res.send({ result: entry.favorites });
  } else {
    res.send({ result: 0 });
  }

  client.close();
}

export async function increaseNum(client: MongoClient, server: string) {
  const db = client.db("mhsf");
  const collection = db.collection("meta");
  const find = await collection.find({ server: server }).toArray();

  if (find.length == 0) {
    collection.insertOne({ server: server, favorites: 1 });
  } else {
    const entry = find[0];
    collection.findOneAndReplace(
      { server: server },
      { server: server, favorites: entry.favorites + 1 }
    );
  }
}

export async function decreaseNum(client: MongoClient, server: string) {
  const db = client.db("mhsf");
  const collection = db.collection("meta");
  const find = await collection.find({ server: server }).toArray();

  if (find.length == 0) {
    return;
    // Physically is impossible
  } else {
    const entry = find[0];
    collection.findOneAndReplace(
      { server: server },
      { server: server, favorites: entry.favorites - 1 }
    );
  }
}
