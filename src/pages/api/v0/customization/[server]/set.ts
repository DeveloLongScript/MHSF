import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { Document, MongoClient, WithId } from "mongodb";

const validColors = [
  "zinc",
  "slate",
  "stone",
  "gray",
  "neutral",
  "red",
  "rose",
  "orange",
  "green",
  "blue",
  "yellow",
  "violet",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const server = req.query.server as string;

  const { customization }: { customization: any } = req.body;
  if (
    customization.description != undefined &&
    (!(Array.from(customization.description).length < 1250) ||
      !(Array.from(customization.description).length > 2))
  )
    return res.status(400).send({ message: "Description is incorrect length" });

  if (
    customization.banner != undefined &&
    !(Array.from(customization.banner).length > 5)
  )
    return res.status(400).send({ message: "Banner is incorrect length" });

  if (
    customization.discord != undefined &&
    !/^\d*\.?\d*$/.test(customization.discord)
  )
    return res
      .status(400)
      .send({ message: "Discord server has invalid chars" });

  if (
    customization.colorScheme != undefined &&
    !validColors.includes(customization.colorScheme)
  )
    return res.status(400).send({ message: "Color doesn't exist" });

  if (customization == null) {
    res.status(400).send({ message: "Couldn't find data" });
    return;
  }
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const collection = db.collection("owned-servers");
  const customizationColl = db.collection("customization");
  if (!((await collection.findOne({ server, author: userId })) == undefined)) {
    const alreadyExists =
      (await customizationColl.findOne({ server })) != undefined;

    if (!alreadyExists) {
      await customizationColl.insertOne({
        server,
        colorScheme: customization.colorScheme,
        description: customization.description,
        banner: customization.banner,
        discord: customization.discord,
      });
    } else {
      const find = (await customizationColl.findOne({
        server,
      })) as WithId<Document>;
      if (customization.colorScheme != undefined)
        await customizationColl.findOneAndUpdate(
          { server },
          { $set: { colorScheme: customization.colorScheme } }
        );
      if (customization.description != undefined)
        await customizationColl.findOneAndUpdate(
          { server },
          { $set: { description: customization.description } }
        );
      if (customization.banner != undefined)
        await customizationColl.findOneAndUpdate(
          { server },
          { $set: { banner: customization.banner } }
        );
      if (customization.discord != undefined)
        await customizationColl.findOneAndUpdate(
          { server },
          { $set: { discord: customization.discord } }
        );
    }
    res.send({ message: "Done!" });
  } else {
    res.status(400).send({ message: "You don't own this server." });
  }
  client.close();
}
