import type { OnlineServer } from "@/lib/types/mh-server";
import IconDisplay from "../icons/minecraft-icon-display";
import { Material } from "@/components/ui/material";

export default function ServerCard({ server }: { server: OnlineServer }) {
  return (
    <Material key={server.name}>
      <span className="flex gap-2 items-center">
        <IconDisplay server={server} />
        {server.name}
      </span>
    </Material>
  );
}
