import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Github, CodeXml } from "lucide-react";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";

import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Image from "next/image";
import { ClerkThemeProvider } from "@/components/clerk/ClerkThemeProvider";
import { useEffectOnce } from "@/lib/useEffectOnce";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkThemeProvider className={GeistSans.className}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <div>{children}</div>{" "}
          <Toaster position="bottom-center" reverseOrder={false} />
        </TooltipProvider>
      </ThemeProvider>
    </ClerkThemeProvider>
  );
}
