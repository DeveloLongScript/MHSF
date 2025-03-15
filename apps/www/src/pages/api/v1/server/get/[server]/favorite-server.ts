/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import type { NextApiResponse, NextApiRequest } from "next";
import { MongoClient } from "mongodb";
import { getAuth } from "@clerk/nextjs/server";
import { waitUntil } from "@vercel/functions";
import { getServerName } from "@/lib/history-util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const server = await getServerName(req.query.server as string);
  const client = new MongoClient(process.env.MONGO_DB as string);

  if (!server) {
    return res.status(400).json({ error: "Server not provided" });
  }

  try {
    await client.connect();
    const db = client.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");
    const favoritesCollection = db.collection("favorites");

    // Use findOne instead of find().toArray() since we only need one document
    const userFavorites = await favoritesCollection.findOne({ user: userId });

    if (!userFavorites) {
      // Use insertOne with { w: 1 } for write acknowledgment
      await favoritesCollection.insertOne(
        { user: userId, favorites: [server] },
        { w: 1 } as any
      );
      await increaseNum(client, server as string);
      return res.send({ favorited: true });
    }

    const existingFavorites = userFavorites.favorites;
    const isFavorite = existingFavorites.includes(server);

    // Update favorites array
    const updatedFavorites = isFavorite
      ? existingFavorites.filter((fav: any) => fav !== server)
      : [...existingFavorites, server];

    // Use updateOne instead of replaceOne for better performance
    await favoritesCollection.updateOne(
      { _id: userFavorites._id },
      { $set: { favorites: updatedFavorites } }
    );

    // Update favorite count
    isFavorite
      ? await decreaseNum(client, server as string)
      : await increaseNum(client, server as string);

    res.send({ favorited: !isFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Ensure client is always closed
    waitUntil(client.close());
  }
}

// Optimized helper functions
export async function increaseNum(client: MongoClient, server: string) {
  const db = client.db("mhsf");
  const collection = db.collection("meta");

  // Use $inc operator for atomic increment
  await collection.updateOne(
    { server },
    { $inc: { favorites: 1 }, $set: { date: new Date() } },
    { upsert: true }
  );
}

export async function decreaseNum(client: MongoClient, server: string) {
  const db = client.db("mhsf");
  const collection = db.collection("meta");

  // Use $inc operator for atomic decrement
  await collection.updateOne(
    { server },
    { $inc: { favorites: -1 } },
    { upsert: true }
  );
}
