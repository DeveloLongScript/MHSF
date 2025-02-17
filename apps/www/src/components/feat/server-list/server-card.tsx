import type { OnlineServer } from "@/lib/types/mh-server";
import IconDisplay from "../icons/minecraft-icon-display";
import { Material } from "@/components/ui/material";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ServerCard({ server }: { server: OnlineServer }) {
  return (
    <Material key={server.name}>
      <span className="flex gap-2 items-center">
        <IconDisplay server={server} />
        <strong className="text-lg">{server.name}</strong>
      </span>
      <Tooltip>
        <TooltipTrigger>
          <span className="text-muted-foreground">
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
