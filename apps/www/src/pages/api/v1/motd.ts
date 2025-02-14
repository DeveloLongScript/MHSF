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

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Deprecated - moved exclusively to the client
  // const initalList: Array<{ server: string; motd: string }> = req.body.motd;
  // const resultedList: Array<{ server: string; motd: string }> = [];
  // var interval = 0;
  // if (initalList != undefined && initalList.forEach != undefined) {
  //   initalList.forEach((c, i) => {
  //     parseToHTML(c.motd)
  //       .then((m) => {
  //         interval++;
  //         resultedList.push({ motd: m, server: c.server });
  //         if (interval == initalList.length) {
  //           res.send({ result: resultedList });
  //         }
  //       })
  //       .catch(() => {
  //         resultedList.push({ motd: "Error to grab MOTD", server: c.server });
  //         if (i == initalList.length - 1) {
  //           res.send({ result: resultedList });
  //         }
  //       });
  //   });
  // } else {
  //   res.status(400).send({
  //     message: "Wrong structure.. you might be using the legacy MOTD.",
  //   });
  // }
}
