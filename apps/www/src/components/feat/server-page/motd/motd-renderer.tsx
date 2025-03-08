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

import { miniMessage } from "minimessage-js";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/lib/hooks/use-settings-store";

const Font = localFont({ src: "./motd-font.ttf" });

export function MOTDRenderer({
  className,
  children,
  minecraftFont,
}: {
  className?: string;
  children: string;
  minecraftFont?: boolean;
}) {
  const [result, setResult] = useState("");
  const [error, setError] = useState(false);
  const { get } = useSettingsStore();

  useEffect(() => {
    try {
      setResult(miniMessage().toHTML(miniMessage().deserialize(children)));
    } catch (e) {
      setError(true);
      setResult(
        "Error while parsing MOTD. \n Please let the server owners know."
      );
    }
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: result,
      }}
      className={cn(
        className,
        minecraftFont
          ? error
            ? ""
            : (get("mc-font") ?? "true") === "true"
              ? Font.className
              : ""
          : ""
      )}
    />
  );
}
