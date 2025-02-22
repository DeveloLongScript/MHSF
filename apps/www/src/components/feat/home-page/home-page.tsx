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

"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClerk, useUser } from "@clerk/nextjs";
import { ArrowDown, GalleryVertical } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Gradient } from "stripe-gradient";

export default function HomePageComponent() {
  const clerk = useClerk();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { resolvedTheme } = useTheme();
  const [gradientId, setGradientId] = useState("gradient-banner");

  useEffect(() => {
    setGradientId("gradient-banner");
    const gradient = new Gradient();
    gradient.initGradient("#" + gradientId);
  }, [gradientId]);

  return (
    <div className="pt-20">
      <canvas
        id={gradientId}
        // Slightly outside of container to give a REALLY nice glow effect
        className="w-screen h-[610px] absolute blur-sm border-b z-1 opacity-0 animate-fade-in [--animation-delay:800ms]"
        style={
          {
            "--gradient-color-1":
              resolvedTheme === "dark" ? "#043D5D" : "#1F9EA3",
            "--gradient-color-2":
              resolvedTheme === "dark" ? "#032E46" : "#F8BD97",
            "--gradient-color-3":
              resolvedTheme === "dark" ? "#23B684" : "#9E5428",
            "--gradient-color-4":
              resolvedTheme === "dark" ? "#0F595E" : "#EEEEEE",
            webKitMaskImage:
              "linear-gradient(to top, black, black, transparent)",
            maskImage: "linear-gradient(to top, black, black, transparent)",
          } as React.CSSProperties
        }
        height="64"
        width={window.screen.width}
      />
      <div className="rounded-lg p-[72px] dark:bg-grid-white/[0.2] bg-grid-black/[0.2] w-full mx-auto relative z-9 min-h-[600px]">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-[rgb(10,10,10)] bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] " />

        <h1 className="bg-clip-text animate-fade-in -translate-y-4 bg-gradient-to-br from-black from-30% to-black/40 pb-6 text-5xl font-semibold tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-5xl md:text-6xl lg:text-7xl dark:from-white dark:to-white/40">
          Meet MHSF, <br />
          the modern server list
        </h1>
        <p className="animate-fade-in mb-12 -translate-y-4 text-balance text-lg tracking-tight text-neutral-400 opacity-0 [--animation-delay:400ms] md:text-xl ">
          MHSF is the next generation Minehut server list wrapper, with <br />
          interactive filters, customizable web-pages, a modern interface and{" "}
          <br />
          everything in-between.
        </p>

        <span className="flex items-center gap-2 -translate-y-4">
          <Button
            onClick={() => router.push("/servers")}
            className="animate-fade-in opacity-0 [--animation-delay:600ms] flex items-center gap-2"
          >
            <GalleryVertical size={16} />
            Find a server
          </Button>
          <Button
            variant="secondary"
            onClick={() => clerk.openSignUp()}
            disabled={isSignedIn}
          >
            Sign up
          </Button>
        </span>
      </div>
      <div className="mx-auto justify-center py-15 py-auto w-full text-center text-sm border border-dashed group h-[150px]">
        <span>See more</span>
        <span className="flex justify-center group-hover:translate-y-6 transition-all">
          <ArrowDown size={16} />
        </span>
      </div>
      <br />
      <br />
      <div className="flex items-center justify-center w-full">
        <span className="animate-fade-in -translate-y-4 bg-green-400/60 px-4 py-2 rounded">
          For players
        </span>
      </div>
      <span className="mt-15 flex justify-between px-6 items-center">
        <span>
          <h1 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-2xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-2xl md:text-3xl lg:text-4xl dark:from-white dark:to-white/40">
            Find what you want now. <br />
            Not later.
          </h1>
          <p className="animate-fade-in mb-12 -translate-y-4 text-balance text-md tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
            MHSF is built for finding servers, and only that, along with <br />
            allowing for maximum customizability with <br />
            both your experience and the webpages you interact with. <br />
          </p>
        </span>
        <Skeleton className="h-[300px] w-[500px] rounded-xl" />
      </span>
    </div>
  );
}
