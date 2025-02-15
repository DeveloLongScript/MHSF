import { NotFoundComponent } from "@/components/util/not-found";
import type { Metadata } from "next";

export const metadata: Metadata = {
  applicationName: "MHSF",
  title: "Page not found · MHSF",
  description: "Couldn't find the page that was requested.",
};

export default function NotFoundPage() {
  return <NotFoundComponent />;
}
