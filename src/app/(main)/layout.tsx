/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import ClientFadeIn from "@/components/ClientFadeIn";
import { CommandBarer } from "@/components/CommandBar";
import { BrandingGenericIcon } from "@/components/Icon";
import TextFromPathname from "@/components/TextFromPathname";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkThemeProvider } from "@/components/clerk/ClerkThemeProvider";
import TopBar from "@/components/clerk/Topbar";
import NewDomainDialog from "@/components/misc/NewDomainDialog";
import ThemedToaster from "@/components/misc/ThemedToaster";
import UnofficalDialog from "@/components/misc/UnofficalDialog";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { TooltipProvider } from "@/components/ui/tooltip";
import { banner } from "@/config/banner";
import NextTopLoader from "@/lib/top-loader";
import type { Metadata, Viewport } from "next";
import { Inter as interFont } from "next/font/google";
import Link from "next/link";

export const extraMetadata = {
	twitter: {
		images: [
			{
				url: "/imgs/icon-cf.png",
			},
		],
	},
	themeColor: "#000000",
	openGraph: {
		images: [
			{
				url: "/imgs/icon-cf.png",
			},
		],
	},
} satisfies Metadata;
export const viewport: Viewport = {
	themeColor: "black",
	colorScheme: "dark",
};

const inter = interFont({ variable: "--font-inter", subsets: ["latin"] });
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkThemeProvider className={GeistSans.className}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<TooltipProvider>
					{banner.isBanner && (
						<div className="bg-orange-600 z-10 w-screen h-8 border-b fixed text-black flex items-center text-center font-medium pl-2">
							{banner.bannerText}
						</div>
					)}
					<div
						className={
							"w-screen h-[3rem] border-b fixed backdrop-blur flex z-10 " +
							(banner.isBanner == true ? "mt-8" : "")
						}
					>
						<div className="items-center me-auto mt-2 pl-7 max-sm:mt-3">
							<Breadcrumb>
								<BreadcrumbList>
									<Link href="/">
										<BreadcrumbPage className="max-sm:hidden">
											<BrandingGenericIcon className="max-w-[32px] max-h-[32px] " />
										</BreadcrumbPage>
									</Link>
									<TextFromPathname />
								</BreadcrumbList>
							</Breadcrumb>
						</div>
						<TopBar inter={inter.className} />
					</div>
					<div className={banner.isBanner ? "pt-8" : undefined}>
						<NextTopLoader />
						<ClientFadeIn>{children}</ClientFadeIn>
					</div>{" "}
					<ThemedToaster />
					<CommandBarer />
					<SpeedInsights />
					<Analytics />
					<NewDomainDialog />
					<UnofficalDialog />
				</TooltipProvider>
			</ThemeProvider>
		</ClerkThemeProvider>
	);
}
