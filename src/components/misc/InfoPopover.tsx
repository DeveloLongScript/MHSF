import Link from "next/link";
import { Button } from "../ui/button";
import { Activity, Calendar, Star, TerminalIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Changelog, version } from "@/version";
import events from "@/lib/commandEvent"

export default function InfoPopover() {
  const [changeLog, setChangelog] = useState(false);

  return (
    <div className="grid w-full">
      <strong className="text-center">The future of Minehut lists</strong>
      <small className="text-center">
        Use filters, intuitive keyboard shortcuts and other features for
        completely free, and *open-source. <br /> Currently on version{" "}
        <code>{version}</code>.<br />{" "}
        <small>* Licensed under the MIT License</small>
      </small>
      <br />

      <Button variant={"ghost"} onClick={() => setChangelog(true)}>
        <Calendar size={18} className="mr-2" /> Changelog
      </Button>
      <Dialog open={changeLog} onOpenChange={setChangelog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changelog</DialogTitle>
            <Changelog />
          </DialogHeader>
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
      <Button variant="ghost" onClick={() => events.emit("cmd-event")}>
        <TerminalIcon size={18} className="mr-2" /> Open commands
      </Button>
    </div>
  );
}
