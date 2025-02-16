import { FormSpinner } from "@/components/ui/form-spinner";
import { Material } from "@/components/ui/material";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OnlineServer } from "@/lib/types/mh-server";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Statistics({
  totalPlayers,
  totalServers,
  topServer,
}: {
  totalPlayers: number;
  totalServers: number;
  topServer: OnlineServer;
}) {
  const [averagesLoading, setAveragesLoading] = useState(true);
  const [error, setError] = useState(false);
  const [averages, setAverages] = useState<
    | {
        totalServerAverage: number;
        totalPlayerAverage: number;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    try {
      (async () => {
        const fetchRes = await fetch("/api/v0/history/meta-daily-avg");
        const fetchJson: {
          totalServerAverage: number;
          totalPlayerAverage: number;
        } = await fetchRes.json();

        setAveragesLoading(false);
        setAverages(fetchJson);
      })();
    } catch (e) {
      console.log(e);
      setError(true);
    }
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      <Material className="gap-2">
        <strong className="flex items-center gap-1">
          Total Players
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon size={14} />
            </TooltipTrigger>
            <TooltipContent>
              For players, the first number represents the current amount of
              <br />
              players, while the second one represents the average of the last
              <br />
              100 entries of players.
            </TooltipContent>
          </Tooltip>
        </strong>
        <span className="text-lg flex items-center gap-1">
          <span
            className={
              !averagesLoading && !error
                ? (averages?.totalPlayerAverage as number) > totalPlayers
                  ? "text-red-400"
                  : "text-green-400"
                : ""
            }
          >
            {totalPlayers}
          </span>
          <AnimatePresence>
            {!averagesLoading && !error && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="text-muted-foreground/80"
              >
                {Math.round(averages?.totalPlayerAverage as number)}
              </motion.span>
            )}
          </AnimatePresence>
          {averagesLoading && <FormSpinner />}
        </span>
      </Material>
      <Material className="gap-2">
        <strong className="flex items-center gap-1">
          Total Servers
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon size={14} />
            </TooltipTrigger>
            <TooltipContent>
              For servers, the first number represents the current amount of
              <br />
              servers, while the second one represents the average of the last
              <br />
              100 entries of servers.
            </TooltipContent>
          </Tooltip>
        </strong>
        <span className="text-lg flex items-center gap-1">
          <span
            className={
              !averagesLoading && !error
                ? (averages?.totalServerAverage as number) > totalServers
                  ? "text-red-400"
                  : "text-green-400"
                : ""
            }
          >
            {totalServers}
          </span>
          <AnimatePresence>
            {!averagesLoading && !error && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="text-muted-foreground/80"
              >
                {Math.round(averages?.totalServerAverage as number)}
              </motion.span>
            )}
          </AnimatePresence>
          {averagesLoading && <FormSpinner />}
        </span>
      </Material>
      <Material className="gap-2">
        <strong>Top Server</strong> <br />
        <span className="text-lg"> {topServer.name}</span>
      </Material>
    </div>
  );
}
