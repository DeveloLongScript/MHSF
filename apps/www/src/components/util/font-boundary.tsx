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
import { useSettingsStore } from "@/lib/hooks/use-settings-store";
import { Inter, Roboto } from "next/font/google";
import { useEffect, useState, type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});
const overflowXHiddenPages = ["/home"];

export function FontBoundary({
  children,
}: {
  children?: ReactNode | ReactNode[];
}) {
  const settingsStore = useSettingsStore();
  const [fontFamily, setFontFamily] = useState("inter");
  const pathname = usePathname();

  useEffect(() => {
    setFontFamily((settingsStore.get("font-family") ?? "inter") as string);
    window.addEventListener("font-family-change", () => {
      setFontFamily((settingsStore.get("font-family") ?? "inter") as string);
    });
  }, [settingsStore]);

  return (
    <body
      className={`font-${fontFamily} ${(() => {
        switch (fontFamily) {
          case "geist-sans":
            return GeistSans.className;
          case "roboto":
            return roboto.className;
          case "inter":
            return inter.className;
          default:
            return "system-ui-font--font-boundary";
        }
      })()} ${pathname !== null && overflowXHiddenPages.includes(pathname) ? "overflow-x-hidden" : ""}`}
    >
      {children}
    </body>
  );
}
