"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/util/link";
import useStatus from "@/lib/hooks/use-status";
import { cn } from "@/lib/utils";

export function FooterStatus() {
  const { loading, incidents, statusURL } = useStatus();

  const determineIfOutage = () => {
    return (
      !loading && incidents !== null && (incidents as Array<any>).length > 0
    );
  };

  const determineWhatOutage = () => {
    if (incidents !== null)
      return {
        name: (incidents as Array<any>)[0].attributes.name,
        id: (incidents as Array<any>)[0].id,
      };
    return null;
  };

  if (!loading)
    return (
      <Link
        href={`https://${statusURL as string}${determineIfOutage() ? `/incident/${determineWhatOutage()?.id}` : ""}`}
        noExtraIcons
        target="_blank"
      >
        <Button variant="tertiary">
          <span
            className={cn(
              "text-sm flex items-center gap-2 font-normal",
              determineIfOutage() ? "text-orange-400" : "text-blue-600"
            )}
          >
            <div
              className={cn(
                "items-center",
                determineIfOutage()
                  ? "bg-orange-400"
                  : "bg-blue-600 dark:bg-blue-600"
              )}
              style={{
                width: ".5rem",
                height: ".5rem",
                borderRadius: "9999px",
              }}
            />
            {determineIfOutage()
              ? determineWhatOutage()?.name
              : "All systems normal"}
          </span>
        </Button>
      </Link>
    );
}
