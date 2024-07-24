import Image from "next/image";
import { GeistSans } from "geist/font/sans";
import ServerList from "@/components/ServerList";
import { Button } from "@/components/ui/button";
import { ModeToggle as ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserProfile,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { X, UserCog, Server } from "lucide-react";
import TopBar from "@/components/clerk/Topbar";
import { banner } from "@/banner";
import { ResolvingMetadata, Metadata } from "next";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {banner.isBanner && (
        <div className="bg-orange-600 w-screen h-8 border-b fixed text-black flex items-center text-center font-medium pl-2">
          {banner.bannerText}
        </div>
      )}

      <div
        className={
          "w-screen h-12 border-b fixed backdrop-blur flex " +
          (banner.isBanner == true ? "mt-8" : "")
        }
      >
        <div className="me-auto mt-3 pl-7">
          <Breadcrumb>
            <BreadcrumbList>
              <Link href="/">
                <BreadcrumbPage className="max-sm:hidden">
                  <Server />
                </BreadcrumbPage>
              </Link>
              <BreadcrumbSeparator className="max-sm:hidden" />
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <TopBar />
      </div>
      <div className="  pt-[60px] p-4">
        <ServerList />
      </div>
    </main>
  );
}
