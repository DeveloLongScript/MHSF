"use client";
import { Spinner } from "@/components/ui/spinner";
import { useServers } from "@/lib/hooks/use-servers";
import ServerCard from "./server-card";
import { Separator } from "@/components/ui/separator";
import { Statistics } from "./statistics";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteScrolling } from "@/lib/hooks/use-infinite-scrolling";

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
            <ServerCard server={c} key={c.name} />
          ))}
        </div>
      </InfiniteScroll>
    </main>
  );
}
