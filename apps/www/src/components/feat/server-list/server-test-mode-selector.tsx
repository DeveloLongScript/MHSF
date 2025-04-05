import { AnimatedText } from "@/components/ui/animated-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";

export function ServerTestModeSelector({
  testModeStatus,
  testModeLoading,
  testModeEnabled,
}: {
  testModeStatus: string;
  testModeLoading: boolean;
  testModeEnabled: boolean;
}) {
  const [tm] = useQueryState("tm", { defaultValue: "" });

  if (testModeEnabled || tm !== "")
    return (
      <div className="pl-5 flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger>
            <span className="relative flex size-2.5 pt-[1px] items-center cursor-pointer">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  testModeLoading ? "bg-orange-500" : "bg-green-400"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex size-2.5 rounded-full",
                  testModeLoading ? "bg-orange-500" : "bg-green-500"
                )}
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>Test mode was enabled.</TooltipContent>
        </Tooltip>
        <AnimatedText
          className="text-muted-foreground top-[2.5px] left-[6px] min-w-[70vw]"
          text={testModeStatus}
          glimmer={testModeLoading}
        />
      </div>
    );

  return null;
}
