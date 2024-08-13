import { OnlineServer } from "@/lib/types/mh-server";
import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { MongoClient } from "mongodb";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "mhsf" });

// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [
    inngest.createFunction(
      { id: "short-term-data" },
      [{ cron: "*/30 * * * *" }, { event: "test/30-min" }],
      async ({ event, step }) => {
        const mongo = new MongoClient(process.env.MONGO_DB as string);
        try {
          const mh = await (
            await fetch("https://api.minehut.com/servers", {
              headers: {
                accept: "application/json",
                "accept-language": Math.random().toString(),
                priority: "u=1, i",
                "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Content-Type": "application/json",
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

          await mha.insertOne({
            total_players: mh.total_players,
            total_servers: mh.total_servers,
            unix: Date.now(),
          });

          mh.servers.forEach(async (server: OnlineServer, i: number) => {
            const serverFavoritesObject = await meta.findOne({
              server: server.name,
            });
            let favorites = 0;
            if (serverFavoritesObject != undefined)
              favorites = serverFavoritesObject.favorites;

            await dbl.insertOne({
              player_count: server.playerData.playerCount,
              favorites,
              server: server.name,
              date: new Date(),
            });
          });
          await mongo.close();

          return {
            event,
            body: "Finished adding " + mh.servers.length + " servers.",
          };
        } catch (e) {
          await mongo.close();

          return { event, body: "Cloudflare.. aborting " + e };
        }
      }
    ),
  ],
});
