"use client";

import { useSettingsStore } from "@/lib/hooks/use-settings-store";
import { Inter, Roboto } from "next/font/google";
import { useEffect, useState, type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export function FontBoundary({
  children,
}: {
  children?: ReactNode | ReactNode[];
}) {
  const settingsStore = useSettingsStore();
  const [fontFamily, setFontFamily] = useState("inter");

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
      })()}`}
    >
      {children}
    </body>
  );
}
