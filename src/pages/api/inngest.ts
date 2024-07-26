// inngest in mh-stats provides information periodicly. like every 30 minutes for historical data.
// its fully automatic

import Favorites from "@/app/account/favorites/page";
import { OnlineServer } from "@/components/ServerView";
import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { MongoClient } from "mongodb";
import { Noto_Sans_Mahajani } from "next/font/google";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app" });

// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [
    inngest.createFunction(
      { id: "every-60-min" },
      [{ cron: "*/30 * * * *" }, { event: "every-60-min" }],
      async ({ event, step }) => {
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

              return {
                event,
                body: "Finished adding " + mh.servers.length + " servers.",
              };
            }
          });
        } catch (e) {
          mongo.close();
          return { event, body: "Cloudflare.. aborting " + e };
        }
      },
    ),
    inngest.createFunction(
      { id: "every-two-months" },
      [{ cron: "0 0 1 */2 *" }],
      async ({ event, step }) => {
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

        return {
          event,
          body: "Dropped database. ",
        };
      },
    ),
  ],
});
