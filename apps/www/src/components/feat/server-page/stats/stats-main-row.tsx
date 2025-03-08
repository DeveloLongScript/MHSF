import { Separator } from "@/components/ui/separator";
import type { ServerResponse } from "@/lib/types/mh-server";

export function StatisticsMainRow({ server }: { server: ServerResponse }) {
  return (
    <span className="border rounded-xl p-4 relative col-span-2 min-h-[250px] max-h-[250px]">
      <strong className="text-lg">Statistics</strong>
      <br />
      <Separator className="my-2" />
    </span>
  );
}
