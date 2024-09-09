// MHSF crontab scripts
// by dvelo - licensed under MIT license

import chalk from "chalk";

console.log(chalk.yellow(chalk.bold("MHSF crontab scripts")));
console.log(chalk.yellow(chalk.bold("by dvelo - licensed under MIT license")));
console.log();

import { MongoClient, WithId } from "mongodb";
import { config } from "dotenv";
import {
	OnlineServer,
	OnlineServerExtended,
	ServerResponse,
} from "./types/mh-server.js";
import { CronJob } from "cron";
import { Achievement } from "./types/achievement.js";

// set-up config
config({
	path: process.env.MHC_DOCKER != "true" ? "../.env.local" : "./.env.local",
});

let mongo = new MongoClient(process.env.MONGO_DB as string);

const SUCCESS = chalk.green("SUCCESS");
const ERROR = chalk.red("ERROR");
const WARN = chalk.red("WARN");
const INFO = chalk.blueBright("INFO");

console.log(INFO, "Starting cron job #1");

CronJob.from({
	cronTime: "*/30 * * * *",
	onTick: function () {
		periodicCronJob().catch((e) => {
			console.log(chalk.red("[CRON] " + ERROR + " Error while running: "));
			console.error(e);
		});
	},
	start: true,
	timeZone: "America/Los_Angeles",
});

console.log(INFO, "Starting cron job #2");
CronJob.from({
	cronTime: "0 */12 * * *",
	onTick: function () {
		achievementTask().catch((e) => {
			console.log(chalk.red("[CRON] " + ERROR + " Error while running: "));
			console.error(e);
		});
	},
	start: true,
	timeZone: "America/Los_Angeles",
});

/**
 * Main function that runs the script.
 *
 * @remarks
 * Connects to the MongoDB instance, fetches the server data from the Minehut API, and inserts the total player and server count into the "mh" collection.
 * Then, it iterates over each server and inserts the player count, server name, and date into the "history" collection.
 * If an error occurs, it logs the error and closes the MongoDB connection.
 */
async function periodicCronJob() {
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

			process.stdout.clearLine(0);
			process.stdout.cursorTo(0);
			process.stdout.write(
				"[CRON] " +
					INFO +
					" Remaining servers: " +
					(y + "/" + mh.servers.length),
			);
			y++;
			if (y == mh.servers.length) {
				process.stdout.clearLine(0);
				process.stdout.cursorTo(0);
				process.stdout.write(
					"[CRON] " + SUCCESS + " Finished! Closing MongoDB connection.",
				);

				return;
			}
		});
	} catch (e) {
		console.log("[CRON] " + ERROR + " Error while parsing JSON:", e);

		return;
	}
}

async function achievementTask() {
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
		const meta = mongo.db("mhsf").collection("meta");
		const achievements = mongo.db("mhsf").collection("achievements");
		console.log("adding achievements");

		mh.servers.forEach(async (server: OnlineServer, i: number) => {
			const serverFavoritesObject = await meta.findOne({
				server: server.name,
			});
			let favorites = 0;
			if (serverFavoritesObject != undefined)
				favorites = serverFavoritesObject.favorites;

			const srvExt: OnlineServerExtended = {
				...server,
				favorites,
				position: { joins: i + 1 },
			};
			const prevAchievements = ((await achievements.findOne({
				name: server.name,
			})) || { _id: "", name: server.name, achievements: [] }) as WithId<{
				name: string;
				achievements: Achievement[];
			}>;

			const achievementsTsk = await achievementEngine(
				srvExt,
				prevAchievements.achievements,
			);

			await achievements.insertOne({
				name: server.name,
				achievements: achievementsTsk,
			});
		});
	} catch (e) {
		console.log("[CRON] " + ERROR + " Error while parsing JSON:", e);

		return;
	}
}

async function achievementEngine(
	server: OnlineServerExtended,
	currentAchievements: Achievement[],
): Promise<Achievement[]> {
	const achievements: Array<Achievement> = [];

	if (
		server.favorites >= 1000 &&
		currentAchievements.find((c) => c.type == "has1kFavorites") === undefined
	) {
		achievements.push({
			type: "has1kFavorites",
			date: new Date().toISOString(),
		});
	}

	if (
		server.favorites >= 100000 &&
		currentAchievements.find((c) => c.type == "has100kFavorites") === undefined
	) {
		achievements.push({
			type: "has100kFavorites",
			date: new Date().toISOString(),
		});
	}

	if (
		server.playerData.playerCount >= 2 &&
		currentAchievements.find((c) => c.type == "has1kTotalJoins") === undefined
	) {
		const v: { server: ServerResponse } = await (
			await fetch(
				"https://api.minehut.com/server/" + server.name + "?byName=true",
			)
		).json();

		if (v.server.joins >= 1000) {
			achievements.push({
				type: "has1kTotalJoins",
				date: new Date().toISOString(),
			});
		}
	}
	if (
		server.playerData.playerCount >= 10 &&
		currentAchievements.find((c) => c.type == "has100kTotalJoins") === undefined
	) {
		const v: { server: ServerResponse } = await (
			await fetch(
				"https://api.minehut.com/server/" + server.name + "?byName=true",
			)
		).json();

		if (v.server.joins >= 100000) {
			achievements.push({
				type: "has100kTotalJoins",
				date: new Date().toISOString(),
			});
		}
	}

	if (server.position.joins === 1) {
		achievements.push({
			type: "mostJoined",
			date: new Date().toISOString(),
		});
	}

	return achievements;
}
