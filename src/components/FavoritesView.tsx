/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

"use client";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { Card, CardHeader, CardTitle } from "./ui/card";
import type { ServerResponse } from "@/lib/types/mh-server";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { Button } from "./ui/button";
import { Copy, Layers, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { getAccountFavorites } from "@/lib/api";
import { useRouter } from "@/lib/useRouter";
import { Skeleton } from "./ui/skeleton";
import FadeIn from "react-fade-in/lib/FadeIn";

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
              const apiClone = apiFavorites;
              apiClone.push(c.server);
              setApiFavorites(apiClone);
              if (num === d.length) {
                setLoading(false);
              }
            })
        );
      });
      if (d.length === 0) setLoading(false);
    });
  });

  if (loading) {
    return (
      <>
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
          <Skeleton className="h-[147px] rounded-xl" />
        </div>
      </>
    );
  }

  return (
    <>
      {apiFavorites.length === 0 && (
        <div className="flex items-center justify-center">
          <XIcon />
          Your favorites are empty. Maybe favorite a server!
        </div>
      )}
      <FadeIn>
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
      </FadeIn>
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
