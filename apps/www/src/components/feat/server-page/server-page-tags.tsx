"use client";
import type { OnlineServer, ServerResponse } from "@/lib/types/mh-server";
import { type ReactNode, useState } from "react";
import type { BadgeColor } from "../server-list/server-card";
import { allTags } from "@/config/tags";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

export function ServerPageTags(props: {
  server: ServerResponse;
  onlineServer?: OnlineServer;
  className?: string;
  unclickable?: boolean;
}) {
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [compatibleTags, setCompatibleTags] = useState<
    Array<{
      name: ReactNode;
      docsName?: string;
      tooltip: string;
      htmlDocs: string;
      role: BadgeColor;
    }>
  >([]);

  const [tagOpen, setTagOpen] = useQueryState(
    "t",
    parseAsArrayOf(parseAsString).withOptions({
      history: "push",
      shallow: true,
    })
  );

  useEffectOnce(() => {
    if (loading === undefined) {
      setLoading(true);
      setCompatibleTags([]);

      const tagPromises = allTags.map(async (tag) => {
        try {
          if (
            !tag.condition ||
            (await tag.condition({
              server: props.server,
              online: props.onlineServer,
            }))
          ) {
            const name = await tag.name({
              server: props.server,
              online: props.onlineServer,
            });
            return {
              name,
              docsName: tag.docsName,
              tooltip: tag.tooltipDesc,
              htmlDocs: tag.htmlDocs,
              role: tag.role === undefined ? "default" : tag.role,
            };
          }
        } catch (error) {
          console.error("Error processing tag:", error);
        }
        return null;
      });

      Promise.all(tagPromises)
        .then((results) => {
          setCompatibleTags(results.filter(Boolean) as any[]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading tags:", error);
          setLoading(false);
        });
    }
  });

  const toggleTagInQuery = async (
    tagName: string | undefined,
    shouldAdd: boolean
  ) => {
    if (!tagName) return;

    try {
      const currentTags = tagOpen || [];

      if (shouldAdd) {
        if (!currentTags.includes(btoa(tagName))) {
          await setTagOpen([...currentTags, btoa(tagName)]);
        }
      } else {
        const filteredTags = currentTags.filter((tag) => tag !== btoa(tagName));
        await setTagOpen(filteredTags.length > 0 ? filteredTags : null);
      }
    } catch (error) {
      console.error("Failed to update URL params:", error);
    }
  };

  if (loading) {
    return <></>;
  }

  return (
    <div
      className="font-normal tracking-normal flex flex-wrap"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {compatibleTags.map((t) => {
        const tagName = t.docsName || "";
        const isOpen = tagOpen?.includes(btoa(tagName)) || false;

        return (
          <span key={tagName || String(t.name)} className="mr-1">
            {props.unclickable ? (
              <Badge variant={t.role} className={props.className}>
                {t.name}
              </Badge>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleTagInQuery(tagName, true);
                    }}
                  >
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
                <Dialog
                  open={isOpen}
                  onOpenChange={(open) => {
                    toggleTagInQuery(tagName, open);
                  }}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {'"'}
                        {t.docsName === undefined ? t.name : t.docsName}
                        {'"'} documentation
                      </DialogTitle>
                      <DialogDescription className="font-normal">
                        <div
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: t.htmlDocs }}
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}
