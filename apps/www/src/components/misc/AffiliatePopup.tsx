/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2025 dvelo
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

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import useClipboard from "@/lib/useClipboard";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

export default function AffiliatePopup() {
  const [textCopied, setTextCopied] = useState(false);
  const clipboard = useClipboard();

  return (
    <DialogHeader>
      <DialogTitle className="text-black dark:text-white">CoreBoxx</DialogTitle>
      <DialogDescription className="text-black dark:text-white text-md">
        We won't claim to be a "unique server" or any of that. But we do aim to
        give you the highest quality BoxPvP! Here's what we have: <br /> - 50
        progression mines over 11 worlds, plus many more for events and other
        items <br /> - Balanced gear sets - just because someone is a bit ahead
        of you doesn't mean you deserve to die in one shot <br /> - We're
        non-P2W, and we mean it! All perks are for convenience or benefit
        everyone online! <br /> - A rapidly-growing, tight-knit community with
        events and giveaways <br /> - Quests and storyline in development, in
        case mining gets boring <br />
        <br />
        <code className="border my-2 p-3 flex rounded">
          CoreBoxx.minehut.gg{" "}
        </code>
        <div
          className="border rounded p-2 mb-8 text-sm"
          style={{ backgroundColor: "hsl(var(--background))" }}
        >
          CoreBoxx is an official affiliate of MHSF. This server was found to be
          a high-quality server and should be a good join for any player!
        </div>
      </DialogDescription>
      <span className="w-full grid grid-cols-3 gap-2 opacity-80 backdrop-blur">
        <Button onClick={() => window.open("/server/CoreBoxx", "_blank")}>
          Open Page
        </Button>
        <Button
          onClick={() => {
            setTextCopied(true);
            clipboard.writeText("CoreBoxx.mhsf.minehut.gg");
            setTimeout(() => setTextCopied(false), 1000);
          }}
        >
          {textCopied ? (
            <Check size={16} className="flex items-center" />
          ) : (
            <p>Copy IP</p>
          )}
        </Button>
        <DialogTrigger asChild>
          <Button variant="outline">Close</Button>
        </DialogTrigger>
      </span>
    </DialogHeader>
  );
}
