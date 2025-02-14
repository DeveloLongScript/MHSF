import { auth, getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb"
import jwt from "jsonwebtoken"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = getAuth(req)

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const client = new MongoClient(process.env.MONGO_DB as string);
    await client.connect();

    const collection = client.db("mhsf").collection("migrations")
    const find = await collection.find({oldUserId: userId}).toArray()
    if (find.length !== 0) {
        return res.json({validationToken: jwt.sign({userId, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, find[0].secret)})
    }
    const secret = createRandomString(60)
    await collection.insertOne({oldUserId: userId, secret, date: Date.now()})

    res.send({validationToken: jwt.sign({userId, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, secret)})
}

function createRandomString(length: number) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}