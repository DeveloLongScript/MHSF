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
import { getServerQuery } from "@/lib/history-util";

interface MonthlyAverage {
  month: string;
  result: number;
}

interface ResponseData {
  result: MonthlyAverage[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { message: string }>
) {
  const client = new MongoClientImpl(process.env.MONGO_DB as string);

  try {
    const db = client.db("mhsf").collection("history");
    const server = await getServerQuery(req.query.server as string);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentYear = new Date().getFullYear();

    if (server === null)
      return res.status(400).json({ message: "Invalid server query" });

    // Convert $or query to separate find operations if needed
    const matchStage = server.$or
      ? {
          $match: {
            $or: server.$or,

            date: {
              $gte: new Date(currentYear, 0, 1),
              $lt: new Date(currentYear + 1, 0, 1),
            },
          },
        }
      : {
          $match: server,
          date: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        };

    // Use MongoDB aggregation pipeline for better performance
    const monthlyAverages = (await db
      .aggregate([
        matchStage,
        {
          $group: {
            _id: { $month: "$date" },
            averagePlayerCount: { $avg: "$player_count" },
          },
        },
        {
          $project: {
            _id: 0,
            month: { $arrayElemAt: [months, { $subtract: ["$_id", 1] }] },
            result: { $floor: "$averagePlayerCount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray()) as MonthlyAverage[];

    res.send({ result: monthlyAverages });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching data" });
  } finally {
    await client.close();
  }
}
