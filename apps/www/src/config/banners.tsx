/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
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

import GradientBanner from "@/components/effects/gradient-banner";
import MainBanner from "@/components/feat/MainBanner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import AffiliatePopup from "@/components/misc/AffiliatePopup";
import { Gradient } from "stripe-gradient";
import {useRouter} from "@/lib/useRouter";
import {pageFind} from "@/components/misc/Link"

export const defaultBanners: {
  bannerSpace: number;
  bannerContent: React.ReactNode;
}[] = [
  // The affilation banner ALWAYS has to be first.
  {
    bannerSpace: 1,
    bannerContent: (
      <>
        <AffiliateBanner />
      </>
    ),
  },
];

function AffiliateBanner() {
  const router = useRouter();

  return (
    <>
      <div onClick={() => router.push(pageFind("Special:GitHub/releases/tag/1.8.0") as string)} className="cursor-pointer">
        <MainBanner size={1} className="max-h-[2rem] border-0">
          <GradientBanner>
            <strong>v2</strong>: the future of MHSF
          </GradientBanner>
        </MainBanner>
      </div>
    </>
  );
}

export const bannerHooks: (() =>
  | { bannerSpace: number; bannerContent: React.ReactNode }
  | undefined)[] = [
  () => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production")
      return {
        bannerSpace: 1,
        bannerContent: (
          <MainBanner className="bg-orange-600">
            Your not in production!{" "}
            <Link href="https://mhsf.app">
              <Button variant="link" className="dark:text-black">
                Go to production
              </Button>
            </Link>
          </MainBanner>
        ),
      };
    return undefined;
  },
];
