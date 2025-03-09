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

// Define types for our data
interface ServerHistoricalRecord {
  server: string;
  [key: string]: unknown;
}

interface ResponseData {
  data: Record<string, unknown>[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { message: string }>
) {
  const client = new MongoClientImpl(process.env.MONGO_DB as string);

  try {
    const db = client.db("mhsf").collection("historical");
    const server = req.query.server as string;
    const scopes: string[] = checkForInfoOrLeave(res, req.body.scopes);

    // Only fetch the fields we need using projection
    const projection: Record<string, 1> = { server: 1 };
    for (const scope of scopes) {
      projection[scope] = 1;
    }

    const allData = await db
      .find<ServerHistoricalRecord>({ server }, { projection })
      .toArray();

    // Use map instead of forEach for better performance
    const data = allData.map((d) => {
      const result: Record<string, unknown> = {};
      for (const scope of scopes) {
        result[scope] = d[scope];
      }
      return result;
    });

    res.send({ data });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching data" });
  } finally {
    await client.close();
  }
}

function checkForInfoOrLeave(
  res: NextApiResponse,
  info: string[] | undefined
): string[] {
  if (info === undefined) {
    res.status(400).json({ message: "Information wasn't supplied" });
    return [];
  }
  return info;
}
