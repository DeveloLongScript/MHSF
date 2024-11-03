"use client";

import {
	Check,
	ChevronsUpDown,
	GalleryVerticalEnd,
	ServerCrashIcon,
} from "lucide-react";
import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { version } from "@/config/version";
import { useRouter } from "@/lib/useRouter";

export function VersionSwitcher() {
	const router = useRouter();

	return (
		<div>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
							<GalleryVerticalEnd className="size-4" />
						</div>
						<div className="flex flex-col gap-0.5 leading-none">
							<span className="font-semibold">Documentation</span>
							<span className="">v{version}</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						onClick={() => router.push("/")}
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-mhsf text-sidebar-primary">
							<ServerCrashIcon className="size-4" />
						</div>
						<div className="flex flex-col gap-0.5 leading-none">
							<span className="font-semibold">MHSF</span>
							<span className="">v{version}</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</div>
	);
}
