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

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { usePathname } from "next/navigation";

declare global {
  interface Document {
    startViewTransition(updateCallback: () => void):
      | {
          finished: Promise<void>;
          ready: Promise<void>;
          updateCallbackDone: Promise<void>;
        }
      | undefined;
  }
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NextThemesProvider
      forcedTheme={pathname?.startsWith("/server") ? "dark" : undefined}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

interface UseThemeTransitionResult {
  theme: string | undefined;
  changeTheme: (changeTheme: string) => void;
  mounted: boolean;
}

export function useThemeTransition(): UseThemeTransitionResult {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const changeTheme = (changeTheme: string) => {
    if (!mounted) return;

    const resolvedTheme = theme === "system" ? systemTheme : changeTheme;

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        const root = document.documentElement;
        root.style.setProperty(
          "--current-background",
          `var(--${resolvedTheme}-background)`
        );
        root.style.setProperty(
          "--current-foreground",
          `var(--${resolvedTheme}-foreground)`
        );
        setTheme(changeTheme);
      });
    } else {
      setTheme(changeTheme);
    }
  };

  React.useEffect(() => {
    if (mounted && theme) {
      const root = document.documentElement;
      root.style.setProperty(
        "--current-background",
        `var(--${theme}-background)`
      );
      root.style.setProperty(
        "--current-foreground",
        `var(--${theme}-foreground)`
      );
    }
  }, [mounted, theme]);

  return { theme, changeTheme, mounted };
}
