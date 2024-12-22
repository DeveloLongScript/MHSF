"use client";

import ClientFadeIn from "@/components/ClientFadeIn";
import { BrandingGenericIcon } from "@/components/Icon";
import TextFromPathname from "@/components/TextFromPathname";
import TopBar from "@/components/clerk/Topbar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import NextTopLoader from "@/lib/top-loader";
import Link from "next/link";
import BannerContainer from "@/components/feat/BannerContainer";
import { Inter } from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
export default function LayoutPart({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BannerContainer
        className={"w-screen h-[3rem] border-b fixed backdrop-blur flex z-10"}
        style={(size: number) => ({
          marginTop: `${2 * size}rem`,
        })}
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
      </BannerContainer>
      <BannerContainer
        style={(size: number) => ({
          paddingTop: `${2 * size}rem`,
        })}
      >
        <NextTopLoader />
        <ClientFadeIn>{children}</ClientFadeIn>
      </BannerContainer>
    </>
  );
}
