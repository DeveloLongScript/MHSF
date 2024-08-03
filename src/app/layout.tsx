import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Github, CodeXml, Server, Command } from "lucide-react";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";

import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Image from "next/image";
import { ClerkThemeProvider } from "@/components/clerk/ClerkThemeProvider";
import { useEffectOnce } from "@/lib/useEffectOnce";
import NextTopLoader from '@/lib/top-loader';
import { banner } from "@/banner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import TopBar from "@/components/clerk/Topbar";
import TextFromPathname from "@/components/TextFromPathname";
import { Inter as interFont } from "next/font/google";
import {
  CommandBar,
  CommandBarer,
  SearchCommandBar,
  SubLinkCommandBar,
} from "@/components/CommandBar";

const inter = interFont({ variable: "--font-inter", subsets: ["latin"] });
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
          
          {banner.isBanner && (
            <div className="bg-orange-600 w-screen h-8 border-b fixed text-black flex items-center text-center font-medium pl-2">
              {banner.bannerText}
            </div>
          )}
          <div
            className={
              "w-screen h-12 border-b fixed backdrop-blur flex " +
              (banner.isBanner == true ? "mt-8" : "")
            }
          >
            <div className="  me-auto mt-3 pl-7">
              <Breadcrumb>
                <BreadcrumbList>
                  <Link href="/">
                    <BreadcrumbPage className="max-sm:hidden">
                      <Server />
                    </BreadcrumbPage>
                  </Link>
                  <TextFromPathname />
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <TopBar inter={inter.className} />
          </div>
          <div><NextTopLoader/>{children}</div>{" "}
          <Toaster position="bottom-center" reverseOrder={false} />
          <CommandBarer />
        </TooltipProvider>
      </ThemeProvider>
    </ClerkThemeProvider>
  );
}
