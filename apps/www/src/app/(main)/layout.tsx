/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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
import "../globals.css";
import { useSearchParams } from "next/navigation";
import { Inter } from "next/font/google";
import { Placeholder } from "@/components/ui/placeholder";
import { X } from "lucide-react";
import { IsScript } from "@/components/util/is-script";
import { Button } from "@/components/ui/button";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import { NavBar } from "@/components/feat/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const search = searchParams?.get("theme") || "light";

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <noscript>
            <main className="flex justify-center items-center text-center min-h-screen h-max">
              <Placeholder
                icon={<X />}
                title="JavaScript is required for MHSF"
                description="MHSF cannot grab servers or do other external requests without JavaScript."
              >
                <Link href="https://www.enable-javascript.com/">
                  <Button>Here's how</Button>
                </Link>
              </Placeholder>
            </main>
          </noscript>
          <IsScript>
            <NavBar />
            <div className="pt-16">{children}</div>
          </IsScript>
        </body>
      </html>
    </ClerkProvider>
  );
}
