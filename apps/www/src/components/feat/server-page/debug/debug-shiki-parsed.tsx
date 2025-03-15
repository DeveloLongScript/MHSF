import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Wrench } from "lucide-react";
import type { ReactNode } from "react";

export function DebugShikiParsedDrawer({
  children,
  shikiParsed,
}: {
  children: ReactNode | ReactNode[] | undefined;
  shikiParsed: string;
}) {
  return (
    <Drawer direction="right">
      <DrawerContent className="p-4 min-w-[600px] max-h-screen overflow-y-auto">
        <DrawerTitle className="text-lg mb-3 flex items-center gap-2">
          <Wrench size={24} /> Debug Options - MHSF Data
        </DrawerTitle>

        <span dangerouslySetInnerHTML={{ __html: shikiParsed }} />
      </DrawerContent>
      <DrawerTrigger>{children}</DrawerTrigger>
    </Drawer>
  );
}
