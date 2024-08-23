import { GeistSans } from "geist/font/sans";
import { Server } from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkThemeProvider } from "@/components/clerk/ClerkThemeProvider";
import NextTopLoader from "@/lib/top-loader";
import { banner } from "@/banner";
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
import toast from "react-hot-toast";

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
              "w-screen h-12 border-b fixed backdrop-blur flex z-10 " +
              (banner.isBanner == true ? "mt-8" : "")
            }
          >
            <div className="items-center me-auto mt-3 pl-7">
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
          <div>
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
