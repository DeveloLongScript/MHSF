"use client";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { ServerResponse } from "@/lib/types/mh-server";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { Button } from "./ui/button";
import { Copy, Layers, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { getAccountFavorites } from "@/lib/api";
import { useRouter } from "@/lib/useRouter";

export default function FavoritesView() {
  const [apiFavorites, setApiFavorites] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffectOnce(() => {
    getAccountFavorites().then((d) => {
      let num = 0;
      d.forEach((a: any, i: number) => {
        fetch("https://api.minehut.com/server/" + a + "?byName=true").then(
          (b) =>
            b.json().then((c) => {
              num++;
              var apiClone = apiFavorites;
              apiClone.push(c.server);
              setApiFavorites(apiClone);
              if (num == d.length) {
                setLoading(false);
              }
            })
        );
      });
      if (d.length == 0) setLoading(false);
    });
  });

  if (loading) {
    return (
      <>
        <Spinner className="flex items-center" />
        <br />
      </>
    );
  }

  return (
    <>
      {apiFavorites.length == 0 && (
        <div className="flex items-center justify-center">
          <XIcon />
          Your favorites are empty. Maybe favorite a server!
        </div>
      )}
      <div className="grid sm:grid-cols-4 gap-4">
        {apiFavorites.map((server: ServerResponse) => (
          <Card key={server.name}>
            <CardHeader>
              <CardTitle>{server.name}</CardTitle>
              <div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="min-w-[128px] max-w-[328px] mb-2 h-[32px] max-md:hidden"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      server.name + ".mshf.minehut.gg"
                    );
                    toast.success("Copied IP to clipboard");
                  }}
                >
                  <Copy size={18} />
                  <code className="ml-2">{server.name}</code>
                </Button>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-[32px] h-[32px] mb-2 ml-2 max-md:hidden"
                      onClick={() => {
                        router.push("/server/" + server.name);
                      }}
                    >
                      <Layers size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Open up the server page to see more information about the
                    server
                  </TooltipContent>
                </Tooltip>
              </div>
              <code className="text-[14px]">
                {convert(server.joins)} total joins •{" "}
                {server.online ? "Online" : "Offline"}
              </code>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}

function convert(value: number) {
  var result: string = value.toString();
  if (value >= 1000000) {
    result = Math.floor(value / 1000000) + "m";
  } else if (value >= 1000) {
    result = Math.floor(value / 1000) + "k";
  }
  return result;
}
