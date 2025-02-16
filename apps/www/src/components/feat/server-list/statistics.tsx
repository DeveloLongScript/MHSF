import { FormSpinner } from "@/components/ui/form-spinner";
import { Material } from "@/components/ui/material";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OnlineServer } from "@/lib/types/mh-server";
import { ChartArea, HardDriveUpload, InfoIcon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IconDisplay from "../icons/minecraft-icon-display";

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
      <Material className="gap-3">
        <strong className="justify-between flex items-center">
          <span className="flex items-center gap-1">
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
          </span>
          <Users size={16} className="text-muted-foreground" />
        </strong>
        <span className="text-lg flex items-center gap-1">
          <span
            className={
              !averagesLoading && !error
                ? (averages?.totalPlayerAverage as number) > totalPlayers
                  ? "text-rose-400"
                  : "text-lime-400"
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
      <Material className="gap-3">
        <strong className="justify-between flex items-center">
          <span className="flex items-center gap-1">
            Total Servers
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon size={14} />
              </TooltipTrigger>
              <TooltipContent className="max-w-[390px] break-words">
                <p>
                  For servers, the first number represents the current amount of
                  servers, while the second one represents the average of the
                  last 100 entries of servers.
                </p>
                <p className="mt-1">
                  Minehut automatically puts new servers in a queue once the
                  total amount of servers is near or at 3.5k for efficiency
                  reasons. This usually happens during high demand times, most
                  likely during the American summer, in the afternoon.
                </p>
              </TooltipContent>
            </Tooltip>
          </span>

          <HardDriveUpload size={16} className="text-muted-foreground" />
        </strong>
        <span className="text-lg flex items-center gap-1">
          <span
            className={
              !averagesLoading && !error
                ? (averages?.totalServerAverage as number) > totalServers
                  ? "text-rose-400"
                  : "text-lime-400"
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
      <Material className="gap-3">
        <strong className="justify-between flex items-center">
          Top Server <ChartArea size={16} className="text-muted-foreground" />
        </strong>{" "}
        <span className="text-lg gap-2 flex items-center">
          {topServer.name}
          <IconDisplay server={topServer} />
        </span>
      </Material>
    </div>
  );
}
