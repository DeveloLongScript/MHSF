import { ServerProvider } from "@/components/feat/server-page/server-provider";
import type { ServerResponse } from "@/lib/types/mh-server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ server: string }>;
}): Promise<Metadata> {
  const id = (await params).server;
  const { server }: { server: ServerResponse | undefined } = await (
    await fetch("https://api.minehut.com/server/" + id)
  ).json();

  if (server === null) return notFound();

  // Default fallback values
  const defaultName = "Server not found";
  const defaultDescription = "A server on Minehut, find it on MHSF!";

  // Get server name or use fallback
  const serverName = server?.name || defaultName;

  // Generate the absolute URL for the OG image
  const ogImageUrl = new URL(
    `/api/og/server/${id}`,
    process.env.NEXT_PUBLIC_APP_URL || "https://mhsf.app"
  ).toString();

  return {
    applicationName: "MHSF",
    title: `${serverName} | MHSF`,
    openGraph: {
      title: serverName,
      description: defaultDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${serverName} server statistics`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: serverName,
      description: defaultDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${serverName} server statistics`,
        },
      ],
    },
    description: defaultDescription,
  };
}

export default async function ServerPage({
  params,
}: {
  params: Promise<{ server: string }>;
}) {
  const slug = (await params).server;

  return (
    <main>
      <ServerProvider serverId={slug} />
    </main>
  );
}
