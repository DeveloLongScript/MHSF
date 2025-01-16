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
import useStatus from "@/lib/hooks/use-status";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
export default function LayoutPart({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, incidents, statusURL } = useStatus();

  return (
    <>
      <BannerContainer
        className={
          "w-screen h-[3rem] border-b grid-cols-3 fixed backdrop-blur z-10 " +
          (!loading && (incidents as never as Array<any>).length > 0
            ? "grid"
            : "flex")
        }
        style={(size: number) => ({
          marginTop: `${2 * size}rem`,
        })}
      >
        <div className="items-center justify-self-start me-auto mt-2 pl-7 max-sm:mt-3 flex-1">
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
        {!loading &&
          incidents !== null &&
          (incidents as Array<any>).length > 0 && (
            <div className="justify-self-center items-center text-center pb-2 pt-2 rounded border my-1 px-2 bg-red-500 text-white">
              <strong className="text-sm">
                {
                  (
                    incidents[0] as {
                      attributes: { title: string };
                    }
                  ).attributes.title
                }{" "}
              </strong>{" "}
              <span className="text-sm">- MHSF may be down</span>
              <br />
              <Link href={"https://" + statusURL} className="text-sm">
                View MHSF Status
              </Link>
            </div>
          )}

        <div className="justify-self-end">
          <TopBar inter={inter.className} />
        </div>
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
