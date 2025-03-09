/*
 * MHSF, Minehut Server List
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { server } = req.query;
  const client = new MongoClient(process.env.MONGO_DB as string);

  await client.connect();

  const db = client.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");
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
    collection.insertOne({ server: server, favorites: 1, date: new Date() });
  } else {
    const entry = find[0];
    collection.findOneAndReplace(
      { server: server },
      { server: server, favorites: entry.favorites + 1, date: new Date() }
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
