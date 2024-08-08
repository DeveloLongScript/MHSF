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
    </>
  );
}
