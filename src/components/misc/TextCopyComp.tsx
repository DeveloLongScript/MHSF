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
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Check } from "lucide-react";
import useClipboard from "@/lib/useClipboard";

export function TextCopyComp() {
  "use client";
  const clipboard = useClipboard();
  const [textCopied, setTextCopied] = useState(false);

  return (
    <code className="border p-3 rounded">
      MHSFPV.minehut.gg{" "}
      <Button
        size="icon"
        className="ml-1 h-[20px]"
        onClick={() => {
          setTextCopied(true);
          clipboard.writeText("MHSFPV.minehut.gg");
          toast.success("Copied!");
          setTimeout(() => setTextCopied(false), 1000);
        }}
      >
        {textCopied ? (
          <Check size={16} className="flex items-center" />
        ) : (
          <p>Copy</p>
        )}
      </Button>
    </code>
  );
}
