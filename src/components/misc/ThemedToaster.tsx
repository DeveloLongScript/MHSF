"use client";

import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      toastOptions={
        resolvedTheme == "dark"
          ? { style: { background: "#333", color: "#fff" } }
          : undefined
      }
    />
  );
}
