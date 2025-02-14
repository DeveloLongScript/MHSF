import { auth, getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = getAuth(req)
    const { verificationToken: authentication } = req.body
    const { oldUserId } = req.body
    

    if (!userId || authentication === undefined || oldUserId === undefined) {
        return res.status(401).json({ error: 'Unauthorized [1]', auth: authentication === undefined, old: oldUserId === undefined })
    }

    const client = new MongoClient(process.env.MONGO_DB as string);
    await client.connect();

    const migrations = client.db("mhsf").collection("migrations")
    const secret = await migrations.findOne({ oldUserId })

    if (secret === undefined)
        return res.status(401).json({ error: 'Unauthorized [2]' })

    try {
        jwt.verify(authentication.replace('Bearer ', ''), secret?.secret)
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized [3]', jwtError: error })
    }

    // cleanup

    await migrations.findOneAndDelete({_id: new ObjectId(secret?._id)})

    // start migration - succesfully verified

    const verifiedUsers = client.db("mhsf").collection("claimed-users");
    const ownedServers = client.db("mhsf").collection("owned-servers");
    const reports = client.db("mhsf").collection("reports");
    const favorites = client.db("mhsf").collection("favorites");

    try {
        const [ownedResult, verifiedResult, reportsResult, favoritesResult] = await Promise.all([
            ownedServers.updateMany(
                { author: oldUserId },
                { $set: { author: userId } }
            ),
            verifiedUsers.updateMany(
                { userId: oldUserId },
                { $set: { userId: userId } }
            ),
            reports.updateMany(
                { userId: oldUserId },
                { $set: { userId: userId } }
            ),
            favorites.updateMany(
                { user: oldUserId },
                { $set: { user: userId } }
            )
        ]);

        return res.json({
            success: true,
            migrated: {
                ownedServers: ownedResult.modifiedCount,
                verifiedUsers: verifiedResult.modifiedCount,
                reports: reportsResult.modifiedCount,
                favorites: favoritesResult.modifiedCount
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Migration failed', details: error });
    } finally {
        await client.close();
    }
}
