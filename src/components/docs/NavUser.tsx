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

"use client";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	Computer,
	CreditCard,
	LogIn,
	LogOut,
	Moon,
	SettingsIcon,
	Sparkles,
	Sun,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { user, isSignedIn } = useUser();
	const clerk = useClerk();
	const { setTheme, theme } = useTheme();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{isSignedIn && (
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={
											user?.imageUrl == undefined
												? "https://img.clerk.com/preview.png?size=144&seed=seed&initials=AD&isSquare=true&bgType=marble&bgColor=6c47ff&fgType=silhouette&fgColor=FFFFFF&type=user&w=48&q=75"
												: user?.imageUrl
										}
										alt={user?.username || "?"}
									/>
									<AvatarFallback className="rounded-lg">?</AvatarFallback>
								</Avatar>
							)}

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{isSignedIn ? user?.username : "Not logged in"}
								</span>
								<span className="truncate text-xs">
									{user?.primaryEmailAddress?.emailAddress}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						{isSignedIn && (
							<>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage
												src={
													user?.imageUrl == undefined
														? "https://img.clerk.com/preview.png?size=144&seed=seed&initials=AD&isSquare=true&bgType=marble&bgColor=6c47ff&fgType=silhouette&fgColor=FFFFFF&type=user&w=48&q=75"
														: user?.imageUrl
												}
												alt={user?.username || "?"}
											/>
											<AvatarFallback className="rounded-lg">?</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{user?.username}
											</span>
											<span className="truncate text-xs">
												{user?.primaryEmailAddress?.emailAddress}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
							</>
						)}

						<DropdownMenuGroup>
							<DropdownMenuRadioGroup
								onValueChange={(c) => setTheme(c)}
								value={theme}
							>
								<DropdownMenuRadioItem value="dark">
									<Moon /> Dark
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="light">
									<Sun /> Light
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="system">
									<Computer /> System
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuGroup>

						{isSignedIn && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem onSelect={() => clerk.openUserProfile()}>
										<SettingsIcon />
										Account Settings
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-red-500"
										onSelect={() => clerk.signOut()}
									>
										<LogOut />
										Log out
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</>
						)}
						{!isSignedIn && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem onSelect={() => clerk.openSignIn()}>
										<LogIn />
										Sign in
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
