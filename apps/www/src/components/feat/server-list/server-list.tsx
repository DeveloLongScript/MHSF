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
import { Spinner } from "@/components/ui/spinner";
import { useServers } from "@/lib/hooks/use-servers";
import ServerCard from "./server-card";
import { Separator } from "@/components/ui/separator";
import { Statistics } from "./statistics";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteScrolling } from "@/lib/hooks/use-infinite-scrolling";
import { useMHSFServer } from "@/lib/hooks/use-mhsf-multiple";
import { ModificationButton } from "./modification/modification-button";

export function ServerList() {
  const { servers, loading, serverCount, playerCount } = useServers();
  const { itemsLength, fetchMoreData, hasMoreData, data } =
    useInfiniteScrolling(servers);

  if (loading)
    return (
      <div className="absolute top-[50%] left-[50%]">
        <Spinner />
      </div>
    );

  return (
    <main className="px-3 lg:px-16">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-3">
        Statistics
      </h1>
      <Statistics
        totalServers={serverCount}
        totalPlayers={playerCount}
        topServer={servers[0]}
      />
      <Separator className="my-6" />
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl">
        Servers
      </h1>
      <ModificationButton />
      <InfiniteScroll
        dataLength={itemsLength}
        next={fetchMoreData}
        hasMore={hasMoreData}
        loader={
          <span className="mt-2 left-[50%] right-[50%] absolute">
            <Spinner />
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-3">
          {data.map((c) => (
            <ServerCard server={c} key={c.staticInfo._id} />
          ))}
        </div>
      </InfiniteScroll>
    </main>
  );
}
