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

interface DailyAverage {
  day: string;
  result: number;
}

interface ResponseData {
  result: DailyAverage[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { message: string }>
) {
  const client = new MongoClientImpl(process.env.MONGO_DB as string);

  try {
    const db = client.db("mhsf").collection("history");
    const server = req.query.server as string;
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Use MongoDB aggregation pipeline for better performance
    const dailyAverages = (await db
      .aggregate([
        {
          $match: { server },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$date" },
            averagePlayerCount: { $avg: "$player_count" },
          },
        },
        {
          $project: {
            _id: 0,
            day: { $arrayElemAt: [daysOfWeek, { $subtract: ["$_id", 1] }] },
            result: { $floor: "$averagePlayerCount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray()) as DailyAverage[];

    res.send({ result: dailyAverages });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching data" });
  } finally {
    await client.close();
  }
}
