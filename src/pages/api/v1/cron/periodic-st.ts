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
  try {
    const mh = await (
      await fetch("https://api.minehut.com/servers", {
        headers: {
          accept: "*/*",
          "accept-language": Math.random().toString(),
          priority: "u=1, i",
          "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          Referer: "http://localhost:3000/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      })
    ).json();

    const mha = mongo.db("mhsf").collection("mh");
    const meta = mongo.db("mhsf").collection("meta");
    const dbl = mongo.db("mhsf").collection("history");
    mha.insertOne({
      total_players: mh.total_players,
      total_servers: mh.total_servers,
      unix: Date.now(),
    });
    mh.servers.forEach(async (server: OnlineServer, i: number) => {
      const favorites = (async () => {
        const result = await meta.find({ server: server.name }).toArray();
        if (result.length == 0) {
          return 0;
        }
        return result[0].favorites;
      })();
      const result = await favorites;

      dbl.insertOne({
        player_count: server.playerData.playerCount,
        favorites: result,
        server: server.name,
        time: Date.now(),
      });

      if (i == mh.servers.length) {
        mongo.close();

        return res.send({
          body: "Finished adding " + mh.servers.length + " servers.",
        });
      }
    });
  } catch (e) {
    mongo.close();
    return res.send({
      body: "Cloudflare interferred",
    });
  }
}
