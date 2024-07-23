"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "../ThemeProvider";
import { useEffect, useState } from "react";

export function ClerkThemeProvider({
  children,
  className,
}: {
  children: JSX.Element;
  className: string;
}) {
  const [theme, setTheme] = useState<string | undefined>("");

  return (
    <ClerkProvider
      appearance={{ baseTheme: theme == "dark" ? dark : undefined }}
    >
      <html lang="en" className={className}>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/** This *has* to be implemented in component form for the `useTheme` to load at the appropriate time. */}
            <ThemeElement setTheme={setTheme} />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

function ThemeElement({
  setTheme,
}: {
  setTheme: (update: string | undefined) => void;
}) {
  const theme = useTheme();
  useEffect(() => {
    setTheme(theme.resolvedTheme);
  }, [theme.resolvedTheme, setTheme]);
  return <></>;
}
