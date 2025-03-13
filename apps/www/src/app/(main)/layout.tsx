/*
 * MHSF, Minehut Server List
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

import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import { CommandBarer } from "@/components/CommandBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkThemeProvider } from "@/components/clerk/ClerkThemeProvider";
import NewDomainDialog from "@/components/misc/NewDomainDialog";
import ThemedToaster from "@/components/misc/ThemedToaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Viewport } from "next";
import { Inter as interFont } from "next/font/google";
import LayoutPart from "@/components/feat/LayoutPart";
import AllBanners from "@/components/feat/AllBanners";
import Footer from "@/components/misc/Footer";
import { PostHogProvider } from "@/components/misc/PosthogProvider";

export const viewport: Viewport = {
  themeColor: "black",
  colorScheme: "dark",
};

const inter = interFont({ variable: "--font-inter", subsets: ["latin"] });
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkThemeProvider className={GeistSans.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <PostHogProvider>
            <AllBanners />
            <LayoutPart>{children}</LayoutPart>
            <ThemedToaster />
            <CommandBarer />
            <SpeedInsights />
            <NewDomainDialog />
            <Footer />
          </PostHogProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ClerkThemeProvider>
  );
}
