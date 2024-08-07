import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { MongoClient, ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const client = new MongoClient(process.env.MONGO_DB as string);
  await client.connect();

  const db = client.db("mhsf");
  const users = db.collection("claimed-users");
  const user = await clerkClient.users.getUser(userId);

  if (user.publicMetadata.player == undefined) {
    res.status(400).send({ result: "Hasn't linked yet!" });
    return;
  }
  await users.findOneAndDelete({ player: user.publicMetadata.player });
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: { player: null },
  });

  res.send({ result: "Unlinked!" });

  client.close();
}
