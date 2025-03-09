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

import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient as MongoClientImpl } from "mongodb";

interface ServerHistoryRecord {
  server: string;
  player_count: number;
  date: Date;
}

interface MHRecord {
  total_players: number;
  date: Date;
}

interface RelativeData {
  relativePrecentage: number;
  date: Date;
}

interface ResponseData {
  data: RelativeData[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { message: string }>
) {
  const client = new MongoClientImpl(process.env.MONGO_DB as string);

  try {
    const db = client.db("mhsf").collection("history");
    const mh = client.db("mhsf").collection("mh");
    const server = req.query.server as string;

    // Get only the last 30 records with needed fields
    const recentData = await db
      .find<ServerHistoryRecord>(
        { server },
        {
          projection: { player_count: 1, date: 1 },
          sort: { date: -1 },
          limit: 30,
        }
      )
      .toArray();

    const data: RelativeData[] = [];

    // Process in batches to reduce the number of database queries
    const batchSize = 5;
    for (let i = 0; i < recentData.length; i += batchSize) {
      const batch = recentData.slice(i, i + batchSize);
      const batchQueries = batch.map(async (d) => {
        const dateOfEntry = new Date(d.date);
        const hourBefore = new Date(dateOfEntry.getTime() - 1000 * 60 * 60);
        const hourAfter = new Date(dateOfEntry.getTime() + 1000 * 60 * 60);

        const result = await mh.findOne<MHRecord>(
          {
            date: {
              $gte: hourBefore,
              $lt: hourAfter,
            },
          },
          { projection: { total_players: 1, date: 1 } }
        );

        if (result) {
          return {
            relativePrecentage: d.player_count / result.total_players,
            date: dateOfEntry,
          };
        }
        return null;
      });

      const batchResults = await Promise.all(batchQueries);
      data.push(
        ...batchResults.filter((item): item is RelativeData => item !== null)
      );
    }

    res.send({ data });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching data" });
  } finally {
    await client.close();
  }
}
