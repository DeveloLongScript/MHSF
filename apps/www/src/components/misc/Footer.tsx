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

import { Book } from "lucide-react";
import { BrandingColorfulIcon } from "../Icon";
import { Button } from "../ui/button";
import Github from "../ui/github";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Footer() {
  const { resolvedTheme } = useTheme();

  return (
    <footer>
      <Separator />
      <p className="px-4 pt-8 pb-2">
        <span className="text-xl font-bold text-muted-foreground pb-12 flex items-center">
          <BrandingColorfulIcon className="w-12 h-12 mr-2" />
          MHSF
        </span>

        <p>© {new Date().getFullYear()} dvelo</p>
        <strong className="text-sm">
          MHSF is built with open-source technologies.{" "}
          <Link href="/docs/legal/compliance">
            Please view our compliance documentation for more information.
          </Link>
        </strong>
        <br />
        <span className="flex items-center">
          <Link href="https://github.com/DeveloLongScript/MHSF">
            <Button variant="ghost" size="icon">
              <Github fill={resolvedTheme === "dark" ? "white" : "black"} />
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="ghost" size="icon">
              <Book size={14} />
            </Button>
          </Link>
        </span>
      </p>
    </footer>
  );
}
