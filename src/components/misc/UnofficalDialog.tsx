/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

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
