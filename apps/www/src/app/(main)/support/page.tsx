import { Support } from "@/components/feat/support/support";
import type { Metadata } from "next";

export const metadata: Metadata = {
  applicationName: "MHSF",
  title: "Support · MHSF",
};

export default function SupportPage() {
  return (
    <div>
      <Support />
    </div>
  );
}
