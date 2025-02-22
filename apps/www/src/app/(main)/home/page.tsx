import HomePageComponent from "@/components/feat/home-page/home-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  applicationName: "MHSF",
  title: "The modern server list. · MHSF",
  description:
    "The open-source, modern and friendly server list wrapper for Minehut.",
};

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HomePageComponent />
    </div>
  );
}
