/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
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
import IconDisplay from "@/components/feat/icons/minecraft-icon-display";
import { Badge } from "@/components/ui/badge";
import type { ServerResponse } from "@/lib/types/mh-server";
import { Copy, ExternalLink, ServerCrash } from "lucide-react";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckmarkIcon } from "react-hot-toast";
import useClipboard from "@/lib/useClipboard";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Embed({ params }: { params: { server: string } }) {
  const [serverFound, setServerFound] = useState(true);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [serverObject, setServerObject] = useState<ServerResponse | null>(null);
  const searchParams = useSearchParams();
  const staticMode = searchParams?.get("static") === "true";
  const noShowBranding = searchParams?.get("branding") === "false";
  const clipboard = useClipboard();

  useEffect(() => {
    (async () => {
      const serverFoundResponse = await fetch(
        `https://api.minehut.com/server/${params.server}?byName=true`
      );
      const stream = await serverFoundResponse.json();

      if (stream.server == null) setServerFound(false);
      else setServerObject(stream.server);
      setLoading(false);
    })();
  }, [params]);

  if (loading) {
    return <Spinner />;
  }

  if (!serverFound) {
    notFound();
  }

  return (
    <div className="rounded w-[390px] h-[145px] bg-muted">
      <Link
        className={cn(
          "flex items-center text-sm cursor-pointer border-b p-2",
          staticMode ? "" : "group"
        )}
        href={`/server/${params.server}`}
        target="_blank"
      >
        <ServerCrash
          size={16}
          className="group-hover:text-white p-[4px] group-hover:p-[3px] w-[24px] h-[24px] transition-all bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-500 group-hover:rounded"
        />
        <span className="transition-colors ml-2 group-hover:bg-clip-text group-hover:text-transparent bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-500">
          Powered by MHSF
        </span>
      </Link>
      <div className="px-4 pt-2 flex items-center group overflow-hidden">
        <div className={staticMode ? "block" : "group-hover:block hidden"}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="secondary"
                size="sm"
                className="mb-1"
                onClick={() => {
                  setCopied(true);
                  clipboard.writeText(`${params.server}.mhsf.minehut.gg"`);
                  setTimeout(() => setCopied(false), 1000);
                }}
              >
                {copied ? <CheckmarkIcon /> : <Copy size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy this server IP</TooltipContent>
          </Tooltip>{" "}
          <br />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              window.open(`/server/${params.server}`, "_blank")?.focus();
            }}
          >
            <ExternalLink size={16} />
          </Button>
        </div>
        {serverObject && (
          <IconDisplay
            server={serverObject}
            className={cn(
              "flex items-center mr-2",
              staticMode ? "mb-1 ml-1" : "group-hover:mb-1 group-hover:ml-1"
            )}
          />
        )}

        <div className={cn("block", staticMode ? "mb-1" : " group-hover:mb-1")}>
          <strong className="text-lg flex items-center gap-2">
            {params.server}
            {!noShowBranding && <Badge variant="blue">on Minehut</Badge>}
          </strong>{" "}
          <span className="text-sm">Joined {serverObject?.joins} times</span>
          {serverObject?.online && (
            <span className="flex items-center">
              {serverObject.playerCount === 0 ? (
                <div
                  className="items-center border"
                  style={{
                    width: ".5rem",
                    height: ".5rem",
                    borderRadius: "9999px",
                  }}
                />
              ) : (
                <div
                  className="items-center"
                  style={{
                    backgroundColor: "#0cce6b",
                    width: ".5rem",
                    height: ".5rem",
                    borderRadius: "9999px",
                  }}
                />
              )}
              <span className="text-sm ml-1">
                {serverObject.playerCount} player(s) online
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
