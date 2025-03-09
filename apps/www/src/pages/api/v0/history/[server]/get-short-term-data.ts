import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient as MongoClientImpl } from "mongodb";

// Define types for our data
interface ServerHistoryRecord {
  server: string;
  player_count: number;
  date: Date;
  [key: string]: unknown;
}

interface ResponseData {
  data: Record<string, unknown>[];
  dataMax: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { message: string }>
) {
  const client = new MongoClientImpl(process.env.MONGO_DB as string);

  try {
    const db = client.db("mhsf").collection("history");
    const server = req.query.server as string;
    const scopes: string[] = checkForInfoOrLeave(res, req.body.scopes);

    // Run these queries in parallel for better performance
    const [allData, maxPlayerData] = await Promise.all([
      db.find<ServerHistoryRecord>({ server }).toArray(),
      db
        .find<ServerHistoryRecord>({ server })
        .sort({ player_count: -1 })
        .limit(1)
        .toArray(),
    ]);

    const dataMax =
      maxPlayerData.length > 0 ? maxPlayerData[0].player_count : 0;

    // Use map instead of forEach for better performance
    const data = allData.map((d) => {
      const result: Record<string, unknown> = {};
      for (const scope of scopes) {
        result[scope] = d[scope];
      }
      return result;
    });

    res.send({ data, dataMax });
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
