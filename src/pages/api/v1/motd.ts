import { NextApiRequest, NextApiResponse } from "next";
import parseToHTML from "@/lib/motdEngine";

let num = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  num++;
  var body: Array<{ server: string; motd: string }> = req.body.motd;
  var list: Array<{ server: string; motd: string }> = [];
  var yes = 0;
  if (body != undefined && body.forEach != undefined) {
    body.forEach((c, i) => {
      parseToHTML(c.motd)
        .then((m) => {
          yes++;
          list.push({ motd: m, server: c.server });
          if (yes == body.length) {
            res.send({ result: list });
          }
        })
        .catch(() => {
          list.push({ motd: "Error to grab MOTD", server: c.server });
          if (i == body.length - 1) {
            res.send({ result: list });
          }
        });
    });
  } else {
    res
      .status(400)
      .send({ mes: "Wrong structure.. you might be using the legacy MOTD." });
  }
}
