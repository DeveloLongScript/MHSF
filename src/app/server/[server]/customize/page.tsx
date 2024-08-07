import ServerView from "@/components/ServerView";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TopBar from "@/components/clerk/Topbar";
import { CornerDownLeft, Server, X } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { IconDisplayClient } from "@/components/IconDisplay";
import { banner } from "@/banner";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabServer from "@/components/misc/TabServer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import ServerCustomize from "@/components/ServerCustomize";
import { useColor } from "@/lib/use-color";
import CustomizeRoot from "@/components/CustomizeRoot";

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
        : "https://mcapi.marveldc.me/item/" +
          (json.server.icon == undefined ? "OAK_SIGN" : json.server.icon) +
          "?width=64&height=64",
    openGraph: {
      type: "profile",
      siteName: "MHSF (Minehut Server Finder)",
      images: [
        {
          url:
            "https://mcapi.marveldc.me/item/" +
            json.server.icon +
            "?width=64&height=64",
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
      <CustomizeRoot params={params} />
    </main>
  );
}
