import { OnlineServer } from "@/lib/types/server";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.headers.Authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end("Unauthorized");
  }
  const mongo = new MongoClient(process.env.MONGO_DB as string);
  const meta = mongo.db("mhsf").collection("history");
  const historical = mongo.db("mhsf").collection("historical");

  const array = await meta.find().toArray();
  const result: any = {};

  array.forEach((c) => {
    if (result[c.server] == undefined) {
      result[c.server] = {
        server: c.server,
        player_count: [c.player_count],
        favorites: [c.favorites],
        time: Date.now(),
      };
    } else {
      result[c.server] = {
        server: c.server,
        player_count: [...result[c.server]?.player_count, c.player_count],
        favorites: [...result[c.server]?.favorites, c.favorites],
        time: c.time,
      };
    }
  });

  historical.insertMany(Object.values(result));
  meta.drop();
  mongo.close();

  return res.send({
    body: "Dropped database. ",
  });
}
