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

import {
	ArrowUpToLine,
	Bell,
	BookIcon,
	Check,
	Globe,
	Home,
	Keyboard,
	Link,
	Lock,
	Menu,
	MessageCircle,
	Paintbrush,
	Settings,
	Video,
} from "lucide-react";
import * as React from "react";

import Marquee from "@/components/effects/marquee";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { useDepTheme } from "@/lib/getDependentTheming";
import { BorderTopIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import type { SVGProps } from "react";

export function Changelog({
	items,
	children,
}: {
	items: { name: string; id: string; changelog: ReactNode }[];
	children: ReactNode;
}) {
	const [inTab, setInTab] = useState(false);
	const [tab, setTab] = useState("");
	const iconTheme = useDepTheme();

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="md:overflow-hidden p-0 max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
				<SidebarProvider>
					<Sidebar
						collapsible="none"
						className="hidden md:flex md:max-h-[500px]"
					>
						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												isActive={!inTab}
												onClick={() => {
													setInTab(false);
													setTab("");
												}}
											>
												<ArrowUpToLine /> Top
											</SidebarMenuButton>
										</SidebarMenuItem>
										<SidebarSeparator />

										{items.map((item) => (
											<SidebarMenuItem key={item.name}>
												<SidebarMenuButton
													asChild
													isActive={tab === item.id}
													onClick={() => {
														setTab(item.id);
														setInTab(true);
													}}
												>
													<span>{item.name}</span>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
					</Sidebar>
					<main className="flex h-[480px] flex-1 flex-col overflow-hidden">
						<div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-4">
							<DialogTitle>Changelog</DialogTitle>
							{!inTab && (
								<>
									<div className="md:grid md:grid-cols-3 gap-1.5">
										<Button
											className="text-sm hover:h-[60px] animate-all group block max-md:w-full max-md:mt-2"
											onClick={() =>
												window.open(
													"https://discord.com/invite/cCyEeUs",
													"_blank",
												)
											}
										>
											<span className="group-hover:underline flex items-center">
												<Discord className="mr-2" /> Discord
											</span>
											<Marquee
												className="hidden group-hover:flex font-normal"
												style={{ "--duration": "15s" }}
											>
												Join the offical Minehut Discord server! Talk to people
												that like MHSF too!
											</Marquee>
										</Button>
										<Button
											className="text-sm max-md:w-full max-md:mt-2 hover:h-[60px] animate-all group block "
											onClick={() =>
												window.open(
													"https://github.com/DeveloLongScript/MHSF",
													"_blank",
												)
											}
										>
											<span className="group-hover:underline flex items-center">
												<Github className="mr-2" fill={iconTheme} /> Star on
												GitHub
											</span>
											<Marquee
												className="hidden group-hover:flex font-normal"
												style={{ "--duration": "10s" }}
											>
												Support the development of MHSF by starring it on
												GitHub!
											</Marquee>
										</Button>
										<Button
											className="text-sm max-md:w-full max-md:mt-2 hover:h-[60px] animate-all group block "
											onClick={() => window.open("/docs", "_blank")}
										>
											<span className="group-hover:underline flex items-center">
												<BookIcon className="mr-2" size={16} /> See the docs
											</span>
											<Marquee
												className="hidden group-hover:flex font-normal"
												style={{ "--duration": "10s" }}
											>
												See more information about MHSF and how to use it
											</Marquee>
										</Button>
									</div>

									<div>
										Running on commit{" "}
										<code>
											<a
												href={`https://github.com/DeveloLongScript/mhsf/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
											>
												{(
													process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
													"unknown"
												).substring(0, 7)}
											</a>{" "}
											{process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID !=
												undefined &&
												process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID !=
													"" && (
													<>
														{" "}
														| on PR{" "}
														<a
															href={`https://github.com/DeveloLongScript/MHSF/pull/${process.env.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID}`}
														>
															{
																process.env
																	.NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_ID
															}
														</a>{" "}
														by{" "}
														<a
															href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME}`}
														>
															{
																process.env
																	.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME
															}
														</a>
													</>
												)}{" "}
											{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE !=
												undefined &&
												`| ${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE.substring(0, 24)}`}
										</code>
									</div>

									{items.map((item) => (
										<div key={item.id} id={item.id}>
											<Separator />
											<br />
											{item.changelog}
										</div>
									))}
								</>
							)}
							{inTab && (
								<>
									<div>{items.find((c) => c.id === tab)?.changelog}</div>
								</>
							)}
						</div>
					</main>
				</SidebarProvider>
			</DialogContent>
		</Dialog>
	);
}

const Github = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 256 250"
		width="1em"
		height="1em"
		fill="#24292f"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="xMidYMid"
		{...props}
	>
		<path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
	</svg>
);

const Discord = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 256 199"
		width="1em"
		height="1em"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="xMidYMid"
		{...props}
	>
		<path
			d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
			fill="#5865F2"
		/>
	</svg>
);
