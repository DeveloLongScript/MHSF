import type { ReactNode } from "react";
import { default as NextLink } from "next/link";
import { Book, ExternalLink, NotebookText } from "lucide-react";

export default function A({
  children,
  alt,
}: {
  children: string;
  alt: string | ReactNode;
}) {
  return (
    <NextLink
      href={pageFind(children || "")}
      className="no-underline transition duration-300 hover:underline "
      title={children}
    >
      {(children || "").startsWith("Docs:") && (
        <Book size={16} className="mr-[2px] inline-flex" />
      )}
      {(children || "").startsWith("Wiki:") && (
        <NotebookText size={14} className="mr-[2px] mb-[3px] inline-flex" />
      )}
      {alt}
      {(children || "").startsWith("https") && (
        <ExternalLink size={12} className="ml-[2px] mb-[3px] inline-flex" />
      )}
    </NextLink>
  );
}

export function ALegacy({
  children,
  href,
}: {
  children?: string | ReactNode;
  href?: string;
}) {
  return (
    <NextLink
      href={pageFind(href || "")}
      className="no-underline transition duration-300 hover:underline "
      title={href}
    >
      {(href || "").startsWith("Docs:") && (
        <Book size={16} className="mr-[2px] inline-flex" />
      )}
      {(href || "").startsWith("Wiki:") && (
        <NotebookText size={14} className="mr-[2px] mb-[3px] inline-flex" />
      )}
      {children}
      {(href || "").startsWith("https") && (
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
  if (text.startsWith("Server:")) return "/server/" + text.substring(7);
  if (text.startsWith("Wiki:"))
    return "https://minehut.wiki.gg/wiki/" + text.substring(5);
  if (text.startsWith("GitHub:"))
    return "https://github.com/" + text.substring(7);
  if (text === "Special:GitHub")
    return "https://github.com/DeveloLongScript/MHSF";
  if (text.startsWith("Special:GitHub/"))
    return "https://github.com/DeveloLongScript/MHSF/" + text.substring(15);
  return text;
};
