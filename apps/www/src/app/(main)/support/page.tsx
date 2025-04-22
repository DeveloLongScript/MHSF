import { Support } from "@/components/feat/support/support";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  applicationName: "MHSF",
  title: "Support · MHSF",
};

export default function SupportPage() {
  return (
    <div>
      <Suspense>
        <Support />
      </Suspense>
    </div>
  );
}
