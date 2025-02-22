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
