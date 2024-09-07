import ServerView from "@/components/ServerView";
import type { Metadata, ResolvingMetadata } from "next";
import TabServer from "@/components/misc/TabServer";
import ColorProvider from "@/components/ColorProvider";
import AfterServerView from "@/components/AfterServerView";
import Banner from "@/components/Banner";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: { server: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { server } = params;
  const json = await (
    await fetch("https://api.minehut.com/server/" + server + "?byName=true")
  ).json();

  return {
    title:
      json.server == null
        ? "Server doesn't exist | MHSF"
        : json.server.name +
          ", " +
          (json.server.online
            ? json.server.playerCount +
              (json.server.maxPlayers != 10
                ? "/" + json.server.maxPlayers
                : "") +
              " online"
            : "Offline") +
          " | MHSF",
    description:
      json.server == null
        ? `The server ${server} doesn't exist.`
        : `View ${server} on Minehut Server Finder!`,
    authors: json.server == null ? undefined : { name: json.server.owner },
    applicationName: "MHSF (Minehut Server Finder)",
    icons:
      json.server == null
        ? undefined
        : "https://minehut-server-icons-live.s3.us-west-2.amazonaws.com/" +
          (json.server.icon == undefined ? "OAK_SIGN" : json.server.icon) +
          ".png",
    twitter: {},
    openGraph: {
      type: "profile",
      siteName: "MHSF (Minehut Server Finder)",

      images: [
        {
          url:
            "https://minehut-server-icons-live.s3.us-west-2.amazonaws.com/" +
            json.server.icon +
            ".png",
        },
        {
          url: "/favicon.ico",
        },
      ],
    },
  };
}

export default function ServerPage({ params }: { params: { server: string } }) {
  return (
    <main>
      <ColorProvider server={params.server}>
        <div className={"pt-16"}>
          <Banner server={params.server} />
          <Link href="/">
            <Button variant="link" className="text-muted-foreground text-sm">
              <CornerDownLeft size={16} className="mr-2" /> Go back to the
              server list
            </Button>
          </Link>
          <TabServer server={params.server} tabDef="general" />
          <div className="pt-8">
            <ServerView server={params.server} />
          </div>
          <AfterServerView server={params.server} />
        </div>
      </ColorProvider>
    </main>
  );
}
