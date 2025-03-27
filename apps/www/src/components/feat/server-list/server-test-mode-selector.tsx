import { AnimatedText } from "@/components/ui/animated-text";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-orange-500" />
        </span></TooltipTrigger>
        <TooltipContent>Test mode was enabled.</TooltipContent>
        </Tooltip>
        <AnimatedText
          className="text-muted-foreground top-[2.5px] left-[6px] min-w-[70vw]"
          text={testModeStatus}
          glimmer
        />
      </div>
    );

  return null;
}
