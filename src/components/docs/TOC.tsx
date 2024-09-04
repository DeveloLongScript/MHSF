"use client";
import { cn } from "@/lib/utils";
import { Docs } from "contentlayer/generated";
import { useEffect, useMemo, useState } from "react";

export default function TableOfContent({
  doc,
  toc,
}: {
  doc: Docs;
  toc: { level: number; text: string; slug: string };
}) {
  const itemIds = useMemo(
    () =>
      doc?.toc.flatMap(
        (c: { level: number; text: string; slug: string }) => c.slug
      ),
    [doc]
  );
  const activeHeading = useActiveItem(itemIds);

  return <Tree item={toc} activeItem={activeHeading} />;
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  item: { level: number; text: string; slug: string };
  activeItem?: string;
}

function Tree({ item, activeItem }: TreeProps) {
  return (
    <>
      <ul className={cn("m-0 list-none", { "pl-4": item.level !== 1 })}>
        <li key={item.text} className={cn("mt-0 pt-2")}>
          <a
            href={"#" + item.slug}
            className={cn(
              "inline-block no-underline transition-colors hover:text-foreground",
              item.slug === `${activeItem}`
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.text}
          </a>
        </li>
      </ul>
    </>
  );
}
