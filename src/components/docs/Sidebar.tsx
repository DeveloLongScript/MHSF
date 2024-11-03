import * as React from "react";

import { NavUser } from "@/components/docs/NavUser";
import { VersionSwitcher } from "@/components/docs/VersionSwitcher";
import {
	Sidebar as ShadSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { allFolders } from "@/config/docs";

export function Sidebar() {
	return (
		<ShadSidebar>
			<SidebarHeader>
				<VersionSwitcher />
			</SidebarHeader>
			<SidebarContent>
				{/* We create a SidebarGroup for each parent. */}
				{allFolders.map((item) => (
					<SidebarGroup key={item.name}>
						<SidebarGroupLabel>{item.name}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.docs.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<a href={item.url}>{item.title}</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</ShadSidebar>
	);
}
