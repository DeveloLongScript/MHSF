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
import { usePathname } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function TextFromPathname() {
  const pathname = usePathname();

  return (
    <>
      {pathname == "/" && (
        <>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem className="max-sm:hidden">
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
      {pathname?.startsWith("/server") && (
        <>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem className="max-sm:hidden">Server</BreadcrumbItem>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {pathname.split("/server/")[1].split("/")[0]}
            </BreadcrumbPage>
          </BreadcrumbItem>
          {pathname.endsWith("/historical-data") && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Historical Data</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {pathname.endsWith("/customize") && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Customize</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </>
      )}
      {pathname == "/account/favorites" && (
        <>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem>
            <BreadcrumbPage>Favorites</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
      {pathname == "/account/claim-account" && (
        <>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem>
            <BreadcrumbPage>Claim Minecraft Account</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
      {pathname == "/account/settings" && (
        <>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
      {pathname == "/account/settings/options" && (
        <>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Preferences</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
      {pathname == "/legal/external-content-agreement" && (
        <>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem>
            <BreadcrumbPage>Legal</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>ECA Agreement</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
      {pathname == "/sort/favorites" && (
        <>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem>Sort</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Favorites</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </>
  );
}
