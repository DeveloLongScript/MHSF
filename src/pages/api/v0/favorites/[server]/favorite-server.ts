/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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
