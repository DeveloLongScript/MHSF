import { Button } from "@/components/ui/button";
import type { Filter } from "@/lib/types/filter";
import type { Sort } from "@/lib/types/sort";
import { ModificationFileCreationDialog } from "./modification-file-creation-dialog";

type Action = Filter | Sort | { customAction: string };

export function ModificationAction({ value }: { value?: Action }) {
  return (
    <>
      {value !== undefined && "customAction" in value ? (
        <ModificationFileCreationDialog
          type={value.customAction.endsWith("sort") ? "sort" : "filter"}
        >
          <Button size="sm" className="mt-1">
            {value.customAction === "custom-sort"
              ? "Create Sort"
              : "Create Filter"}
          </Button>
        </ModificationFileCreationDialog>
      ) : (
        <Button size="sm">Apply</Button>
      )}
    </>
  );
}
