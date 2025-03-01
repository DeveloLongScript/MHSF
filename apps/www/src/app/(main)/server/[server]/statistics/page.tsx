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

import Banner from "@/components/Banner";
import ColorProvider from "@/components/ColorProvider";
import { NewChart } from "@/components/charts/NewChart";
import ServerView from "@/components/ServerView";
import TabServer from "@/components/misc/TabServer";
import type { Metadata, ResolvingMetadata } from "next";
import StickyTopbar from "@/components/misc/StickyTopbar";
import { RelativeChart } from "@/components/charts/RelativeChart";
import { MonthlyChart } from "@/components/charts/MonthlyChart";
import { DailyChart } from "@/components/charts/DailyChart";

type Props = {
  params: Promise<{ server: string }>;
};

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  // read route params
  const { server } = params;
  const json = await (
    await fetch("https://api.minehut.com/server/" + server + "?byName=true")
  ).json();

  return {
    title:
      json.server == null
        ? "Server doesn't exist | MHSF"
        : json.server.name +
          ", " +
          (json.server.online
            ? json.server.playerCount +
              (json.server.maxPlayers != 10
                ? "/" + json.server.maxPlayers
                : "") +
              " online"
            : "Offline") +
          " | MHSF",
    description:
      json.server == null
        ? `The server ${server} doesn't exist.`
        : `View ${server} on Minehut Server Finder!`,
    authors: json.server == null ? undefined : { name: json.server.owner },
    applicationName: "MHSF (Minehut Server Finder)",
    icons:
      json.server == null
        ? undefined
        : "https://mcapi.marveldc.me/item/" +
          (json.server.icon == undefined ? "OAK_SIGN" : json.server.icon) +
          "?width=64&height=64",
    openGraph: {
      type: "profile",
      siteName: "MHSF (Minehut Server Finder)",
      images: [
        {
          url:
            "https://mcapi.marveldc.me/item/" +
            json.server.icon +
            "?width=64&height=64",
        },
        {
          url: "/favicon.ico",
        },
      ],
    },
  };
}

export default async function ServerPage(props: { params: Promise<{ server: string }> }) {
  const params = await props.params;
  return (
    <main style={{ "color-scheme": "dark" } as React.CSSProperties}>
      <ColorProvider server={params.server}>
        <div className={"pt-[300px] xl:px-[100px]"}>
          <Banner server={params.server} />
          <div className="pt-8 z-1 relative">
            <ServerView server={params.server} />
          </div>

          <StickyTopbar scrollElevation={100} className="pt-4">
            <TabServer server={params.server} tabDef="statistics" />
          </StickyTopbar>
          <br />
          <div className="p-4 gap-4 relative z-1">
            <NewChart server={params.server} />
            <br />
            <RelativeChart server={params.server} />
            <br />
            <div className="grid grid-cols-2 gap-4">
              <MonthlyChart server={params.server} />
              <DailyChart server={params.server} />
            </div>
          </div>
        </div>
      </ColorProvider>
    </main>
  );
}
