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
        className="min-h-screen"
      >
        <NextTopLoader />
        <ClientFadeIn>{children}</ClientFadeIn>
      </BannerContainer>
    </>
  );
}
