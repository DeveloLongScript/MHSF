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

"use client";
import { getCustomization } from "@/lib/api";
import { useEffect, useState } from "react";
import "@/themes.css";
import { toast } from "sonner";
import { useRouter } from "@/lib/useRouter";
import { useEffectOnce } from "@/lib/useEffectOnce";

export default function ColorProvider({
  server,
  children,
  fetchV,
}: {
  server: string;
  children: any;
  fetchV?: any;
}) {
  const [color, setColor] = useState("zinc");
  const nav = useRouter();

  useEffectOnce(() => {
    fetch("https://api.minehut.com/server/" + server + "?byName=true")
      .then((c) => c.json())
      .then((c: any) => {
        console.log(c.server.name, server);
        if (c.server.name !== server) {
          toast.warning(
            "The capitalization of this server was incorrect. If your using a permanent link resource, please change it to account for a new name. (" +
              c.server.name +
              ") Redirecting now.",
            { duration: 15000 }
          );
          nav.replace("/server/" + c.server.name);
        }
      });
  });

  useEffect(() => {
    if (!fetchV)
      getCustomization(server).then((v) =>
        setColor(v != null ? v.colorScheme : "zinc")
      );
    else setColor(fetchV.colorScheme);
  }, []);

  return <div className={`theme-${color}`}>{children}</div>;
}
