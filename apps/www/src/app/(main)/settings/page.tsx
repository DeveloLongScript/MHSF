import { Settings } from "@/components/feat/settings/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  applicationName: "MHSF",
  title: "Settings · MHSF",
  description: "View settings for MHSF",
};

export default function ServerListPage() {
  return (
    <div>
      <Settings />
    </div>
  );
}
