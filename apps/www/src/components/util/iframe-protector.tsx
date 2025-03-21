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

"use client";

import { useIframeCommunication } from "@/lib/hooks/use-iframe-communication";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { type ReactNode, useState } from "react";
import { Spinner } from "../ui/spinner";

export function IframeProtector({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const iframeCommunication = useIframeCommunication();

  useEffectOnce(() => {
    // Make sure top layer frames are actually coming from MHSF
    iframeCommunication.fromIframe.send("ping", { from: "iframe" });
    iframeCommunication.fromIframe.handle("ping", (obj) => {
      if (obj.from === "top-layer") setLoading(false);
    });
  });

  if (loading)
    return (
      <div className="max-w-[800px]">
        <div className="absolute top-[50%] left-[50%]">
          <Spinner />
        </div>
      </div>
    );
  return children;
}
