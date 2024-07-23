import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.send({ message: process.env.IS_AUTH == "true" });
}
