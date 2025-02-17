import { useEffect, useState } from "react";
import type { OnlineServer } from "../types/mh-server";

const itemsPerScroll = 40;

export function useInfiniteScrolling(servers: OnlineServer[]) {
  const [currentOffset, setCurrentOffset] = useState(0);
  const [data, setData] = useState<OnlineServer[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    // Start at the first `itemsPerScroll` servers (duh)
    setData(servers.slice(0, itemsPerScroll));
  }, [servers]);

  return {
    itemsLength: currentOffset + itemsPerScroll,
    fetchMoreData: () => {
      setCurrentOffset(currentOffset + itemsPerScroll);
      const currentData = data;
      const dataSlice = servers.slice(
        currentOffset,
        currentOffset + itemsPerScroll
      );
      const newDataArray = [...currentData, ...dataSlice];

      setData(newDataArray);
      if (dataSlice.length !== itemsPerScroll) setHasMoreData(false);
    },
    hasMoreData,
    data,
  };
}
