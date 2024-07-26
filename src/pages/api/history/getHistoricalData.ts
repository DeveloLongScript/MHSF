import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = new MongoClient(process.env.MONGO_DB as string);
  const db = client.db("mhsf").collection("historical");
  const server = checkForInfoOrLeave(res, req.body.server);
  const scopes: Array<string> = checkForInfoOrLeave(res, req.body.scopes);

  const allData = await db.find({ server }).toArray();
  const data: any[] = [];

  allData.forEach((d) => {
    const result: any = {};
    scopes.forEach((b) => {
      result[b] = d[b];
    });
    data.push(result);
  });

  client.close();
  res.send({ data });
}

function checkForInfoOrLeave(res: NextApiResponse, info: any) {
  if (info == undefined)
    res.status(400).json({ message: "Information wasn't supplied" });
  return info;
}
