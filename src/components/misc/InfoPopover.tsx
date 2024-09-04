import { Button } from "../ui/button";
import { Book, Calendar, Star, TerminalIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { Changelog, version } from "@/config/version";
import events from "@/lib/commandEvent";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "@/lib/useRouter";

export default function InfoPopover() {
  const [changeLog, setChangelog] = useState(false);
  const router = useRouter();

  return (
    <div className="grid w-full">
      <strong className="text-center">The future of Minehut lists</strong>
      <small className="text-center mb-3">
        Use filters, intuitive keyboard shortcuts and other features for
        completely free, and *open-source. <br /> Currently on version{" "}
        <code>{version}</code>.<br />{" "}
        <small>* Licensed under the MIT License</small>
      </small>

      <Button variant={"ghost"} onClick={() => setChangelog(true)}>
        <Calendar size={18} className="mr-2" /> Changelog
      </Button>
      <Dialog open={changeLog} onOpenChange={setChangelog}>
        <DialogContent>
          <ScrollArea className="max-h-[500px]">
            <DialogHeader>
              <DialogTitle>Changelog</DialogTitle>
              <Changelog />
            </DialogHeader>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Button
        variant={"ghost"}
        onClick={() =>
          window
            .open("https://github.com/DeveloLongScript/MHSF", "_blank")
            ?.focus()
        }
      >
        <Star size={18} className="mr-2" /> Star on GitHub
      </Button>
      <Button variant={"ghost"} onClick={() => router.push("/docs")}>
        <Book size={18} className="mr-2" /> See the docs
      </Button>
      <Button variant="ghost" onClick={() => events.emit("cmd-event")}>
        <TerminalIcon size={18} className="mr-2" /> Open commands
      </Button>
    </div>
  );
}
