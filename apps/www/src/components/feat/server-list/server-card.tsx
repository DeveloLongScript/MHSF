/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
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

import type { OnlineServer } from "@/lib/types/mh-server";
import IconDisplay from "../icons/minecraft-icon-display";
import { Material } from "@/components/ui/material";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { allTags } from "@/config/tags";
import { type ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import useClipboard from "@/lib/useClipboard";
import { useRouter } from "next/navigation";
import { MOTDRenderer } from "../server-page/motd/motd-renderer";

export default function ServerCard({ server }: { server: OnlineServer }) {
  const clipboard = useClipboard();
  const router = useRouter();

  return (
    <Material
      className="min-h-[250px] max-h-[250px] cursor-pointer outline-0 group hover:drop-shadow-card-hover focus:drop-shadow-card-hover transition-all"
      onClick={() => router.push(`/server/${server.staticInfo._id}`)}
      tabIndex={0}
      onKeyDown={(e) => {
        // Only send user when they hit "Enter"
        if (e.key === "Enter") router.push(`/server/${server.staticInfo._id}`);
      }}
    >
      <span className="text-sm hidden group-focus-visible:block text-muted-foreground mb-2">
        Hit{" "}
        <kbd className="ml-0.5 hidden rounded px-2 py-0.5 text-xs font-light transition-all duration-75 md:inline-block dark:bg-gray-700 dark:text-gray-400 bg-gray-300 text-gray-600">
          Enter
        </kbd>{" "}
        to go to {server.name}
      </span>
      <span className="flex gap-2 items-center">
        <IconDisplay server={server} />
        <strong className="text-lg">{server.name}</strong>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="square-md"
              className="flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                toast.success("Copied IP address to clipboard.");
                clipboard.writeText(`${server.name}.mhsf.minehut.gg`);
              }}
            >
              <Copy size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            className="max-w-[390px] break-words"
            onClick={(e) => e.stopPropagation()}
          >
            Copy the server address to your clipboard. MHSF automatically adds
            .mhsf in-between the server name and minehut.gg to tell server
            owners where you came from.
          </TooltipContent>
        </Tooltip>
      </span>
      <Tooltip>
        <TooltipTrigger>
          <span className="text-muted-foreground cursor-pointer">
            by {server.author || "Nobody"}
          </span>
        </TooltipTrigger>

        <TooltipContent
          className="max-w-[390px] break-words"
          onClick={(e) => e.stopPropagation()}
        >
          {server.author ? (
            <span>
              {server.name} is owned by{" "}
              <RankColoring author={server.author} rank={server.authorRank} />
            </span>
          ) : (
            <span>
              This server doesn't have a recorded owner because the server owner
              never linked their Minecraft account to their Minehut account.
            </span>
          )}
        </TooltipContent>
      </Tooltip>
      <TagShower server={server} className="mt-1 " />
      {server.motd && (
        <MOTDRenderer
          className="block break-all overflow-hidden mt-3"
          minecraftFont
        >
          {server.motd}
        </MOTDRenderer>
      )}
    </Material>
  );
}

export type BadgeColor =
  | "default"
  | "red"
  | "green"
  | "yellow"
  | "gray"
  | "blue"
  | "purple"
  | "red-subtle"
  | "green-subtle"
  | "yellow-subtle"
  | "gray-subtle"
  | "blue-subtle"
  | "purple-subtle"
  | "custom"
  | "rainbow";

export function TagShower(props: {
  server: OnlineServer;
  className?: string;
  unclickable?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [compatiableTags, setCompatiableTags] = useState<
    Array<{
      name: ReactNode;
      docsName?: string;
      tooltip: string;
      htmlDocs: string;
      role: BadgeColor;
    }>
  >([]);

  useEffectOnce(() => {
    if (loading) {
      allTags.forEach((tag) => {
        if (!tag.condition) {
          tag.name({ online: props.server }).then((n) => {
            compatiableTags.push({
              name: n,
              docsName: tag.docsName,
              tooltip: tag.tooltipDesc,
              htmlDocs: tag.htmlDocs,
              role: tag.role === undefined ? "default" : tag.role,
            });
            setLoading(false);
          });
        } else
          tag.condition({ online: props.server }).then((b) => {
            if (b) {
              tag.name({ online: props.server }).then((n) => {
                compatiableTags.push({
                  name: n,
                  docsName: tag.docsName,
                  tooltip: tag.tooltipDesc,
                  htmlDocs: tag.htmlDocs,
                  role: tag.role === undefined ? "default" : tag.role,
                });
                setLoading(false);
              });
            }
          });
      });
    }
  });

  if (loading) {
    return <></>;
  }

  return (
    <div
      className="font-normal tracking-normal flex flex-wrap"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {compatiableTags.map((t, i) => (
        <span key={t.docsName} className="mr-1">
          {props.unclickable && (
            <Badge variant={t.role} className={props.className}>
              {t.name}
            </Badge>
          )}
          {!props.unclickable && (
            <Dialog key={t.docsName}>
              <DialogTrigger>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant={t.role} className={props.className}>
                      {t.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="font-normal">
                      {t.tooltip}
                      <br />
                      Click the tag to learn more about it.
                    </div>
                  </TooltipContent>
                </Tooltip>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {'"'}
                    {t.docsName == undefined ? t.name : t.docsName}
                    {'"'} documentation
                  </DialogTitle>
                  <DialogDescription
                    className="font-normal"
                    dangerouslySetInnerHTML={{
                      __html: t.htmlDocs,
                    }}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </span>
      ))}
    </div>
  );
}

function RankColoring({ rank, author }: { rank: string; author: string }) {
  switch (rank.toLocaleLowerCase()) {
    case "default":
      return <span className="text-muted-foreground">{author}</span>;
    case "vip":
      return <span className="text-green-700">[VIP] {author}</span>;
    case "vip_plus":
      return <span className="text-lime-500">[VIP+] {author}</span>;
    case "pro":
      return <span className="text-cyan-500">[PRO] {author}</span>;
    case "legend":
      return <span className="text-yellow-500">[LEGEND] {author}</span>;
    case "patron":
      return <span className="text-[#f355ff]">[PATRON] {author}</span>;
    case "mod":
      return <span className="text-yellow-200">[MOD] {author}</span>;
    default:
      return <span className="text-red-500">[STAFF] {author}</span>;
  }
}
