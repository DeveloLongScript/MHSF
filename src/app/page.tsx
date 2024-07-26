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
      <div className="  pt-[60px] p-4">
        <ServerList />
      </div>
    </main>
  );
}
