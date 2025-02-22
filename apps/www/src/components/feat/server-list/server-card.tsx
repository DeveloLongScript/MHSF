import type { OnlineServer } from "@/lib/types/mh-server";
import IconDisplay from "../icons/minecraft-icon-display";
import { Material } from "@/components/ui/material";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function ServerCard({
  server,
  motd,
}: {
  server: OnlineServer;
  motd: string | undefined;
}) {
  return (
    <Material
      key={server.name}
      className="min-h-[250px] max-h-[250px] cursor-pointer outline-0 group hover:drop-shadow-card-hover focus:drop-shadow-card-hover transition-all"
      onClick={() => toast.success("pluh")}
      tabIndex={0}
      onKeyDown={(e) => {
        // Only send user when they hit "Enter"
        if (e.key === "Enter") toast.success("keyboard");
      }}
    >
      <span className="text-sm hidden group-focus-visible:block text-muted-foreground mb-2">
        Hit{" "}
        <kbd className="ml-0.5 hidden rounded px-2 py-0.5 text-xs font-light transition-all duration-75 md:inline-block dark:bg-gray-700 dark:text-gray-400 bg-gray-300 text-gray-600">
          Enter
        </kbd>{" "}
        to go to {server.name}
      </span>
      <span className="flex gap-2 items-center">
        <IconDisplay server={server} />
        <strong className="text-lg">{server.name}</strong>
      </span>
      <Tooltip>
        <TooltipTrigger>
          <span className="text-muted-foreground cursor-pointer">
            by {server.author || "Nobody"}
          </span>
        </TooltipTrigger>

        <TooltipContent className="max-w-[390px] break-words">
          {server.author ? (
            <span>
              {server.name} is owned by{" "}
              <RankColoring author={server.author} rank={server.authorRank} />
            </span>
          ) : (
            <span>
              This server doesn't have a recorded owner because the server owner
              never linked their Minecraft account to their Minehut account.
            </span>
          )}
        </TooltipContent>
      </Tooltip>
      {motd && (
        <span
          className="block break-all overflow-hidden mt-3"
          dangerouslySetInnerHTML={{ __html: motd }}
        />
      )}
    </Material>
  );
}

function RankColoring({ rank, author }: { rank: string; author: string }) {
  switch (rank.toLocaleLowerCase()) {
    case "default":
      return <span className="text-muted-foreground">{author}</span>;
    case "vip":
      return <span className="text-green-700">[VIP] {author}</span>;
    case "vip_plus":
      return <span className="text-lime-500">[VIP+] {author}</span>;
    case "pro":
      return <span className="text-cyan-500">[PRO] {author}</span>;
    case "legend":
      return <span className="text-yellow-500">[LEGEND] {author}</span>;
    case "patron":
      return <span className="text-[#f355ff]">[PATRON] {author}</span>;
    case "mod":
      return <span className="text-yellow-200">[MOD] {author}</span>;
    default:
      return <span className="text-red-500">[STAFF] {author}</span>;
  }
}
