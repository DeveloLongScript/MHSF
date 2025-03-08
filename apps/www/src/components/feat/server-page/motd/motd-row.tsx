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

import { Separator } from "@/components/ui/separator";
import type { ServerResponse } from "@/lib/types/mh-server";
import { MOTDRenderer } from "./motd-renderer";
import useClipboard from "@/lib/useClipboard";
import { miniMessage } from "minimessage-js";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MOTDRow({ server }: { server: ServerResponse }) {
  const clipboard = useClipboard();

  return (
    <div className="border rounded-xl p-4 relative max-h-[250px] ">
      <strong className="text-lg">MOTD</strong>
      <br />
      <Separator className="my-2" />
      <MOTDRenderer
        className={cn("mt-2 break-all overflow-y-auto max-h-[150px]")}
        minecraftFont
      >
        {server.motd}
      </MOTDRenderer>
      <br />
      <small className="absolute bottom-[10px]">
        {server.motd.length} characters,{" "}
        <button
          className="cursor-pointer underline"
          type="button"
          onClick={() => {
            clipboard.writeText(
              miniMessage().toHTML(miniMessage().deserialize(server.motd))
            );
            toast.success("Copied to clipboard.");
          }}
        >
          click to copy HTML
        </button>
      </small>
    </div>
  );
}
