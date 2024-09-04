"use client";
import { usePathname } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { allDocs } from "contentlayer/generated";

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
      {pathname?.startsWith("/docs/") && (
        <>
          <BreadcrumbSeparator className="max-sm:hidden" />
          <BreadcrumbItem>Docs</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {
                allDocs.find(
                  (c) =>
                    c._raw.flattenedPath ===
                    pathname
                      ?.split("/")
                      .splice(2, pathname?.split("/").length)
                      .join("/")
                )?.title
              }
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </>
  );
}
