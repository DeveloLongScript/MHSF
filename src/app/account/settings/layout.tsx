"use client";
import { Sidebar } from "@/components/PreferencesSidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <span className="pt-[48px]">
      <Sidebar curPage={pathname as string}>{children}</Sidebar>
    </span>
  );
}
