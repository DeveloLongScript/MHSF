"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function UnofficalDialog() {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const dialog = localStorage.getItem("unoffical-dialog-open");

    if (dialog == null) {
      setOpen(true);
    }
  }, []);

  const onChangeVal = (state: boolean) => {
    if (state == false) {
      setOpen(false);
      localStorage.setItem("unoffical-dialog-open", "true");
    } else setOpen(state);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChangeVal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to the Minehut Server List (MHSF)</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          MHSF is a Minehut server-list using the Minehut API to serve you
          servers with filters, sorts and other helpful information when picking
          a server to play.{" "}
          <span className="font-bold">
            Keep in mind that MHSF is not endorsed by Minehut or GamerSafer in
            any way, as MHSF is a open-source unofficial project.
          </span>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
