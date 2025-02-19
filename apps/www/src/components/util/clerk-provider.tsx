"use client";

import { ClerkProvider as ImportedClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { MultisessionAppSupport } from "@clerk/nextjs/internal";

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  if (resolvedTheme === "dark") {
    console.log(resolvedTheme);
    return (
      <ImportedClerkProvider appearance={{ baseTheme: dark }}>
        <MultisessionAppSupport>{children}</MultisessionAppSupport>
      </ImportedClerkProvider>
    );
  }
  console.log("a");

  return (
    <ImportedClerkProvider>
      <MultisessionAppSupport>{children}</MultisessionAppSupport>
    </ImportedClerkProvider>
  );
};
