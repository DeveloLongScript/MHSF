import { ServerResponse } from "@/lib/types/mh-server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ server: string }>;
}): Promise<Metadata> {
  const id = (await params).server;
  const { server }: { server: ServerResponse } = await (
    await fetch("https://api.minehut.com/server/" + id)
  ).json();

  return {
    applicationName: "MHSF",
    title: `${server.name} | MHSF`,
    openGraph: {
      title: server.name,
      description: "A server on Minehut, find it on MHSF!",
    },
    description: "A server on Minehut, find it on MHSF!",
     };
}

export default function ServerPage() {}
