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

"use client";

import { Sidebar } from "@/components/docs/Sidebar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { version } from "@/config/version";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import "../../themes.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkThemeProvider } from "@/components/clerk/ClerkThemeProvider";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import NextTopLoader from "@/lib/top-loader";
import { useRouter } from "@/lib/useRouter";
import { allDocs } from "contentlayer/generated";
import { GetServerSideProps } from "next";
import { usePathname } from "next/navigation";

interface Props {
	pathname: string;
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	return (
		<ClerkThemeProvider className="">
			<div className="theme-zinc">
				<NextTopLoader />
				<SidebarProvider>
					<Sidebar />
					<SidebarInset>
						<div className="fixed backdrop-blur w-full flex h-16 z-10 items-center gap-2 px-4 ">
							<SidebarTrigger />
							<Separator orientation="vertical" className="mr-2 h-4" />
							{
								allDocs.find(
									(c) =>
										c._raw.flattenedPath ===
										pathname
											?.split("/")
											.splice(2, pathname?.split("/").length)
											.join("/"),
								)?.title
							}
						</div>
						<div className="px-[100px] pt-[50px]">{children}</div>
					</SidebarInset>
				</SidebarProvider>
			</div>
		</ClerkThemeProvider>
	);
}
