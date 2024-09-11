import { GeistSans } from "geist/font/sans";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkThemeProvider } from "@/components/clerk/ClerkThemeProvider";
import NextTopLoader from "@/lib/top-loader";
import { banner } from "@/config/banner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import TopBar from "@/components/clerk/Topbar";
import TextFromPathname from "@/components/TextFromPathname";
import { Inter as interFont } from "next/font/google";
import { CommandBarer } from "@/components/CommandBar";
import ThemedToaster from "@/components/misc/ThemedToaster";
import UnofficalDialog from "@/components/misc/UnofficalDialog";
import ClientFadeIn from "@/components/ClientFadeIn";
import { BrandingGenericIcon } from "@/components/Icon";
import type { Metadata, Viewport } from "next";

export const extraMetadata = {
  twitter: {
    images: [
      {
        url: "/public/imgs/icon-cf.png",
      },
    ],
  },
  themeColor: "#000000",
  openGraph: {
    images: [
      {
        url: "/public/imgs/icon-cf.png",
      },
    ],
  },
} satisfies Metadata;
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
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          {banner.isBanner && (
            <div className="bg-orange-600 z-10 w-screen h-8 border-b fixed text-black flex items-center text-center font-medium pl-2">
              {banner.bannerText}
            </div>
          )}
          <div
            className={
              "w-screen h-[3rem] border-b fixed backdrop-blur flex z-10 " +
              (banner.isBanner == true ? "mt-8" : "")
            }
          >
            <div className="items-center me-auto mt-2 pl-7 max-sm:mt-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <Link href="/">
                    <BreadcrumbPage className="max-sm:hidden">
                      <BrandingGenericIcon className="max-w-[32px] max-h-[32px] " />
                    </BreadcrumbPage>
                  </Link>
                  <TextFromPathname />
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <TopBar inter={inter.className} />
          </div>
          <div className={banner.isBanner ? "pt-8" : undefined}>
            <NextTopLoader />
            <ClientFadeIn>{children}</ClientFadeIn>
          </div>{" "}
          <ThemedToaster />
          <CommandBarer />
          <SpeedInsights />
          <Analytics />
          <UnofficalDialog />
        </TooltipProvider>
      </ThemeProvider>
    </ClerkThemeProvider>
  );
}
