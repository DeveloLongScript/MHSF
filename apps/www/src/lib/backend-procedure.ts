/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
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

import { clerkClient as ClerkClient, getAuth } from "@clerk/nextjs/server";
import { Db, MongoClient } from "mongodb";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import requestIp from 'request-ip'

type BackendProcedureValue = {
    status: "BANNED" | "OK" | "BLOCKED",
    allowed: boolean,
    mongoClient?: MongoClient,
    defaultDatabase?: Db
}

export async function getBackendProcedure(request: NextApiRequest): Promise<BackendProcedureValue> {
    const mongoClient = new MongoClient(process.env.MONGO_DB as string);
    const {userId} = getAuth(request)
    await mongoClient.connect();
    const defaultDatabase = mongoClient.db(process.env.CUSTOM_MONGO_DB ?? "mhsf");
    const clerkClient = await ClerkClient();

    if (userId !== null) {
        // User exists
        const user = await clerkClient.users.getUser(userId);
        const userBannedMetadata = user.publicMetadata.banned;

        if (userBannedMetadata !== undefined) {
            // User is banned
            await mongoClient.close()
            return {
                status: "BANNED",
                allowed: false
            }
        }
    }

    const detectedIp = requestIp.getClientIp(request);

    if (detectedIp !== null) {
        const collection = defaultDatabase.collection("blocked-ips");

        if (await collection.findOne({ ip: detectedIp }) !== null) {
            await mongoClient.close()
            return { status: "BLOCKED", allowed: false }
        }
    }

    await mongoClient.close()

    return {
        status: "OK",
        allowed: true,
    }
}

function convert(request: Headers) {
    const headersObject: Record<string, string> = {};
    for (const [key, value] of request) {
        headersObject[key] = value;
    }
    return headersObject;
}