import { NextApiRequest, NextApiResponse } from "next";
import parseToHTML from "@/lib/motdEngine";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const initalList: Array<{ server: string; motd: string }> = req.body.motd;
  const resultedList: Array<{ server: string; motd: string }> = [];
  var interval = 0;
  if (initalList != undefined && initalList.forEach != undefined) {
    initalList.forEach((c, i) => {
      parseToHTML(c.motd)
        .then((m) => {
          interval++;
          resultedList.push({ motd: m, server: c.server });
          if (interval == initalList.length) {
            res.send({ result: resultedList });
          }
        })
        .catch(() => {
          resultedList.push({ motd: "Error to grab MOTD", server: c.server });
          if (i == initalList.length - 1) {
            res.send({ result: resultedList });
          }
        });
    });
  } else {
    res.status(400).send({
      message: "Wrong structure.. you might be using the legacy MOTD.",
    });
  }
}
