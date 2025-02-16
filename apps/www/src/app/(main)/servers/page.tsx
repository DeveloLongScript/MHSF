import { ServerList } from "@/components/feat/server-list/server-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  applicationName: "MHSF",
  title: "Server list · MHSF",
  description: "View all servers on Minehut using the MHSF server list.",
};

export default function ServerListPage() {
  return (
    <div>
      <ServerList />
    </div>
  );
}
