/*
 * MHSF, Minehut Server List
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

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
