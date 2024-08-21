import { OnlineServer } from "@/lib/types/mh-server";
import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { Document, MongoClient, ObjectId, WithId } from "mongodb";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  ModalBuilder,
  REST,
  Routes,
  SlashCommandBuilder,
  SlashCommandStringOption,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

let reporting = true;
let initalizedYet = false;
const commands = [
  new SlashCommandBuilder()
    .setName("realive")
    .setDescription("Re-alive an existing report that was glitched")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("id")
        .setRequired(true)
        .setDescription("Report ID")
    ),
];

let client: Client;

// this isn't entirely necessary, to run each time the server starts
async function init() {
  try {
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN as string
    );

    try {
      console.log("[REPORTING] Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_APP_ID as string),
        { body: commands }
      );

      console.log(
        "[REPORTING] Successfully reloaded application (/) commands."
      );
    } catch (error) {
      console.error(error);
    }
  } catch {
    console.log(
      "[REPORTING] Discord API token not found, skipping reporting..."
    );
    reporting = false;
  }
  client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "realive") {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Re-creating report")
            .setColor("Blurple")
            .setDescription("This may take a few seconds.."),
        ],
        ephemeral: true,
      });
      const mongo = new MongoClient(process.env.MONGO_DB as string);
      const db = mongo.db("mhsf");
      const collection = db.collection("reports");
      let reportDoc: WithId<Document> | null;
      try {
        reportDoc = await collection.findOne({
          _id: new ObjectId(interaction.options.getString("id") as string),
        });
      } catch {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Report ID not valid")
              .setColor("Red")
              .setDescription("This report could not be found."),
          ],
        });
        return;
      }

      if (reportDoc === null) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Report not found")
              .setColor("Red")
              .setDescription("This report could not be found."),
          ],
        });
        return;
      }

      report({ data: { ...reportDoc, id: reportDoc._id.toString() } });
    }
  });
  return;
}
// Create a client to send and receive events
export const inngest = new Inngest({ id: "mhsf" });

// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [
    inngest.createFunction(
      { id: "report" },
      { event: "report-server" },
      async ({ event, step }) => {
        if (!reporting) {
          throw new Error("Cannot report server: Discord API token not found");
        }

        if (!initalizedYet) {
          await init();
          initalizedYet = true;
          client.login(process.env.DISCORD_TOKEN);

          console.log(`[REPORTING] Waiting for bot to be ready`);

          client.on("ready", () => {
            console.log(
              `[REPORTING] Bot logged in as ${client.user?.displayName}`
            );
            report(event);
          });
          return;
        }

        report(event);
      }
    ),
    inngest.createFunction(
      { id: "short-term-data" },
      [{ cron: "*/30 * * * *" }, { event: "test/30-min" }],
      async ({ event, step }) => {
        const mongo = new MongoClient(process.env.MONGO_DB as string);
        try {
          const mh = await step.run("grab-servers-from-api", async () => {
            return await (
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
          });

          const mha = mongo.db("mhsf").collection("mh");
          const meta = mongo.db("mhsf").collection("meta");
          const dbl = mongo.db("mhsf").collection("history");

          await mha.insertOne({
            total_players: mh.total_players,
            total_servers: mh.total_servers,
            date: new Date(),
          });

          const completed = await step.run("listing-servers", async () => {
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
              console.log(i, mh.servers.length);
            });
            return true;
          });
          if (completed == true) {
            return { event, body: "Finished!" };
          }
        } catch (e) {
          await mongo.close();

          return { event, body: "Cloudflare.. aborting " + e };
        }
      }
    ),
  ],
});

async function report(event: any) {
  const isTextBased = client.channels.cache.get(
    process.env.REPORTS_CHANNEL as string
  )?.isTextBased;

  if (!isTextBased) {
    throw new Error(
      "Cannot report server: Report channel not found or not a text channel."
    );
  }
  const channel = client.channels.cache.get(
    process.env.REPORTS_CHANNEL as string
  ) as TextChannel;

  const goToServer = new ButtonBuilder()
    .setLabel("Go to server")
    .setStyle(ButtonStyle.Link)
    .setURL("https://list.mlnehut.com/server/" + event.data.server);

  const confirm = new ButtonBuilder()
    .setCustomId("resolve")
    .setLabel("Resolve")
    .setStyle(ButtonStyle.Primary);
  const typed = (name: string) =>
    new ButtonBuilder()
      .setCustomId("typed")
      .setLabel(name + " is typing")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

  const cancel = new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Secondary);

  const undo = new ButtonBuilder()
    .setCustomId("undo")
    .setLabel("Undo")
    .setStyle(ButtonStyle.Danger);

  const undor = new ActionRowBuilder<ButtonBuilder>().addComponents(
    undo,
    goToServer
  );

  const rowN = new ActionRowBuilder<ButtonBuilder>().addComponents(
    confirm,
    cancel,
    goToServer
  );

  const message = await channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("Orange")
        .setTitle("New report to server")
        .setTimestamp()
        .setDescription(
          "A server has been reported by a player. \n Reason: " +
            event.data.reason +
            (event.data.reason == "" ? "*<empty>*" : "")
        )
        .setFields([
          { name: "User ID", value: `\`${event.data.userId}\`` },
          { name: "Server", value: `${event.data.server}` },
        ])
        .setFooter({
          text:
            "Is this report glitched? Use the command /realive id:" +
            event.data._id +
            " to do actions on this report.",
        }),
    ],
    components: [rowN],
  });
  setTimeout(async () => {
    await messageLoop();

    async function messageLoop() {
      const confirmation = await message.awaitMessageComponent({});
      if (confirmation.customId == "undo") {
        (await confirmation.reply({ content: "Done!" })).delete();
        await message.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("Orange")
              .setTitle("New report to server")
              .setTimestamp()
              .setDescription(
                "A server has been reported by a player. \n Reason: " +
                  event.data.reason +
                  (event.data.reason == "" ? "*<empty>*" : "")
              )
              .setFields([
                { name: "User ID", value: `\`${event.data.userId}\`` },
                { name: "Server", value: `${event.data.server}` },
              ])
              .setFooter({
                text:
                  "Is this report glitched? Use the command /realive id:" +
                  event.data._id +
                  " to do actions on this report.",
              }),
          ],
          components: [rowN],
        });
      }
      if (confirmation.customId == "resolve") {
        await message.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle("Server report resolved")
              .setTimestamp()
              .setDescription(
                "The server report has been resolved by <@" +
                  confirmation.user.id +
                  "> \n Reason: " +
                  event.data.reason +
                  (event.data.reason == "" ? "*<empty>*" : "")
              )
              .setFields([
                { name: "User ID", value: `\`${event.data.userId}\`` },
                { name: "Server", value: `${event.data.server}` },
              ])
              .setFooter({
                text:
                  "Is this report glitched? Use the command /realive id:" +
                  event.data._id +
                  " to do actions on this report.",
              }),
          ],
          components: [undor],
        });
        (
          await confirmation.reply({ content: "Done!", ephemeral: true })
        ).delete();
      }

      if (confirmation.customId == "cancel") {
        const modal = new ModalBuilder().setCustomId("why").setTitle("MHSF");
        const favoriteColorInput = new TextInputBuilder()
          .setCustomId("whyToCancel")
          .setLabel("Cancelation reason")
          .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
          favoriteColorInput
        );
        modal.addComponents(row);
        confirmation.showModal(modal);

        try {
          let reportedYet = false;
          await message.edit({
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                typed(
                  confirmation.user.globalName || confirmation.user.username
                )
              ),
            ],
          });
          setTimeout(async () => {
            if (reportedYet == false) {
              await message.edit({
                components: [rowN],
              });

              await messageLoop();
            }

            return;
          }, 60_000);
          const submission = await confirmation.awaitModalSubmit({
            time: 60_000,
          });
          const text = submission.fields.getTextInputValue("whyToCancel");

          if (text == "") {
            await submission.reply({ content: "Done!", ephemeral: true });
            await messageLoop();
          }

          reportedYet = true;

          await message.edit({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle("Server report cancelled")
                .setTimestamp()
                .setDescription(
                  "The server report has been cancelled by <@" +
                    confirmation.user.id +
                    "> \n Reason of cancelation: " +
                    text +
                    "\nReason of report: " +
                    event.data.reason +
                    (event.data.reason == "" ? "*<empty>*" : "")
                )
                .setFields([
                  { name: "User ID", value: `\`${event.data.userId}\`` },
                  { name: "Server", value: `${event.data.server}` },
                ])
                .setFooter({
                  text:
                    "Is this report glitched? Use the command /realive id:" +
                    event.data._id +
                    " to do actions on this report.",
                }),
            ],
            components: [undor],
          });
          await submission.reply({ content: "Done!", ephemeral: true });
        } catch (e) {
          await message.edit({
            components: [rowN],
          });
          await confirmation.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("You took too long!")
                .setDescription("Please try again.")
                .setColor("Red"),
            ],
            ephemeral: true,
          });
        }
      }
      await messageLoop();
    }
  }, 0);
}
