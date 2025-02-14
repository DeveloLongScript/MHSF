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

import type { NextApiRequest, NextApiResponse } from "next";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { data } = req.body;

  if (data === undefined) {
    res.status(400).send({ message: "Couldn't find data" });
    return;
  }
  const { type } = req.body;

  if (type === undefined) {
    res.status(400).send({ message: "Couldn't find data" });
    return;
  }
  if (data === null) {
    await (
      await clerkClient()
    ).users.updateUserMetadata(userId, {
      publicMetadata: { [type]: null },
    });
    res.status(200).send({ message: "Success" });
  }
  if (type !== "srv" && type !== "ipr" && type !== "pad")
    return res.status(400).send({ message: "Couldn't find data" });

  if (type === "srv" && typeof data !== "boolean")
    return res.status(400).send({ message: "Couldn't find data" });

  if (type === "ipr" && typeof data !== "number")
    return res.status(400).send({ message: "Couldn't find data" });

  if (type === "pad" && typeof data !== "number")
    return res.status(400).send({ message: "Couldn't find data" });

  (await clerkClient()).users.updateUserMetadata(userId, {
    publicMetadata: {
      [type]: typeof data === "number" ? data.toString() : data,
    },
  });
  res.status(200).send({ message: "Success" });
}
