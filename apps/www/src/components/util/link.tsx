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

import { type LinkProps, default as NextLink } from "next/link";
import { Book, ExternalLink, NotebookText } from "lucide-react";

export function Link(
  props: LinkProps & {
    children?: React.ReactNode;
    className?: string;
    noExtraIcons?: boolean;
    target?: string;
  }
) {
  const href = props.href as string;

  return (
    <NextLink {...props} href={pageFind(href || "") || "#"} title={href}>
      {!props.noExtraIcons && (
        <>
          {(href || "").startsWith("Docs:") && (
            <Book size={16} className="mr-[2px] inline-flex" />
          )}
          {(href || "").startsWith("Wiki:") && (
            <NotebookText size={14} className="mr-[2px] mb-[3px] inline-flex" />
          )}
        </>
      )}

      {props.children}

      {!props.noExtraIcons && (href || "").startsWith("https") && (
        <ExternalLink size={12} className="ml-[2px] mb-[3px] inline-flex" />
      )}
    </NextLink>
  );
}

export const pageFind = (text: string) => {
  if (text.startsWith("Docs:")) {
    return "/docs/" + text.substring(5).toLowerCase();
  }
  if (text === "Special:Root") return "/";
  if (text === "Special:Preferences") return "/account/settings";
  if (text === "Special:AccountOptions") return "/account/settings/options";
  if (text.startsWith("Server:") && text.endsWith("/Customization"))
    return "/server/" + text.substring(7, text.length - 14) + "/customization";
  if (text === "Special:ClerkConvertionPage")
    return process.env.NEXT_PUBLIC_CLERK_SWITCH_DOMAIN;
  if (text.startsWith("Server:")) return "/server/" + text.substring(7);
  if (text.startsWith("Wiki:"))
    return "https://minehut.wiki.gg/wiki/" + text.substring(5);
  if (text === "GitHub:Issues")
    return "https://github.com/DeveloLongScript/MHSF/issues/new/choose";
  if (text.startsWith("GitHub:"))
    return "https://github.com/" + text.substring(7);
  if (text === "Special:GitHub")
    return "https://github.com/DeveloLongScript/MHSF";
  if (text.startsWith("Special:GitHub/"))
    return "https://github.com/DeveloLongScript/MHSF/" + text.substring(15);
  return text;
};
