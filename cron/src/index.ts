// MHSF crontab scripts
// by dvelo - licensed under MIT license

import chalk from "chalk";

console.log(chalk.yellow(chalk.bold("MHSF crontab scripts")));
console.log(chalk.yellow(chalk.bold("by dvelo - licensed under MIT license")));
console.log();

import { MongoClient } from "mongodb";
import { config } from "dotenv";

// set-up config
config({ path: "../.env.local" });

const mongo = new MongoClient(process.env.MONGO_DB as string);

main().catch((e) => {
  console.log(chalk.red("[CRON] " + ERROR + " Error while running: "));
  console.error(e);
});
const SUCCESS = chalk.green("SUCCESS");
const ERROR = chalk.red("ERROR");
const WARN = chalk.red("WARN");
const INFO = chalk.blueBright("INFO");

/**
 * Main function that runs the script.
 *
 * @remarks
 * Connects to the MongoDB instance, fetches the server data from the Minehut API, and inserts the total player and server count into the "mh" collection.
 * Then, it iterates over each server and inserts the player count, server name, and date into the "history" collection.
 * If an error occurs, it logs the error and closes the MongoDB connection.
 */
async function main() {
  await mongo.connect();
  try {
    // No more mumbo jumbo
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
    console.log("[CRON] " + SUCCESS + " Found", mh.servers.length, "servers");

    const mha = mongo.db("mhsf").collection("mh");
    const meta = mongo.db("mhsf").collection("meta");
    const dbl = mongo.db("mhsf").collection("history");

    await mha.insertOne({
      total_players: mh.total_players,
      total_servers: mh.total_servers,
      date: new Date(),
    });

    let y = 0;

    mh.servers.forEach(async (server: any, i: number) => {
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

      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        "[CRON] " +
          INFO +
          " Remaining servers: " +
          (y + "/" + mh.servers.length)
      );
      y++;
      if (y == mh.servers.length) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(
          "[CRON] " + SUCCESS + " Finished! Closing MongoDB connection."
        );

        // Close connection
        await mongo
          .close()
          .catch((e) =>
            console.log(
              "[CRON] " + WARN + " Error while closing MongoDB connection:",
              e
            )
          );

        return;
      }
    });
  } catch (e) {
    await mongo.close();
    console.log("[CRON] " + ERROR + " Error while parsing JSON:", e);

    return;
  }
}
