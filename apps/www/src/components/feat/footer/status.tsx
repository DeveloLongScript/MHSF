"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/util/link";
import useStatus from "@/lib/hooks/use-status";
import { cn } from "@/lib/utils";

export function FooterStatus() {
  const { loading, incidents, statusURL } = useStatus();

  if (!loading)
    return (
      <Link
        href={`https://${statusURL as string}`}
        noExtraIcons
        target="_blank"
      >
        <Button variant="tertiary">
          <span
            className={cn(
              "text-sm flex items-center gap-2 font-normal",
              "text-blue-600"
            )}
          >
            <div
              className="items-center bg-blue-600 dark:bg-blue-600"
              style={{
                width: ".5rem",
                height: ".5rem",
                borderRadius: "9999px",
              }}
            />
            All systems normal
          </span>
        </Button>
      </Link>
    );
}
