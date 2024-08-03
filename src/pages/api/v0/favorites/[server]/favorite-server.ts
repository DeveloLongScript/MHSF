import type { NextApiResponse, NextApiRequest } from "next";
import { MongoClient, ObjectId } from "mongodb";
import { getAuth } from "@clerk/nextjs/server";
import { decreaseNum, increaseNum } from "./community-favorites";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const server = req.query.server as string;
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("favorites");
  const find = await collection.find({ user: userId }).toArray();

  if (find.length == 0) {
    collection.insertOne({ user: userId, favorites: [server] });
    await increaseNum(client, server);
    res.send({ message: "Favorited " + server });
  } else {
    const collect = find[0];
    let existingFavorites: Array<string> = collect.favorites;
    console.log(collect);

    if (existingFavorites.includes(server)) {
      // remove that favorite from the list
      const index = existingFavorites.indexOf(server);
      await decreaseNum(client, server);
      if (index > -1) {
        existingFavorites.splice(index, 1);
      }
      collection.replaceOne(
        { _id: new ObjectId(collect._id) },
        {
          user: userId,
          favorites: existingFavorites,
        }
      );
      res.send({ message: "Unfavorited " + server });
    } else {
      existingFavorites.push(server);
      await increaseNum(client, server);
      collection.replaceOne(
        { _id: new ObjectId(collect._id) },
        {
          user: userId,
          favorites: existingFavorites,
        }
      );
      res.send({ message: "Favorited " + server });
    }
  }
}
