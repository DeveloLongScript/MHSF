"use client";

import { getCustomization } from "@/lib/api";
import { useEffect, useState } from "react";
import "@/themes.css";

export default function ColorProvider({
  server,
  children,
  fetch,
}: {
  server: string;
  children: any;
  fetch?: any;
}) {
  const [color, setColor] = useState("zinc");

  useEffect(() => {
    if (!fetch)
      getCustomization(server).then((v) =>
        setColor(v != null ? v.colorScheme : "zinc")
      );
    else setColor(fetch != null ? fetch.colorScheme : "zinc");
  }, []);

  return <div className={`theme-${color}`}>{children}</div>;
}
