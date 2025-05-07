import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { type ReactNode, useEffect, useState } from "react";
import { ServerEditorDescription } from "./server-editor-description";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { MilkdownProvider } from "@milkdown/react";
import { Material } from "@/components/ui/material";
import { Placeholder } from "@/components/ui/placeholder";
import { X } from "lucide-react";

export function ServerEditorProvider({
	children,
	serverData,
}: {
	children: ReactNode | ReactNode[];
	serverData: ReturnType<typeof useMHSFServer>;
}) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		window.addEventListener("open-server-editor", () => setOpen(true));
	}, []);

	return (
		<>
			{children}
			<MilkdownProvider>
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerContent className="p-4 ">
						{serverData.server?.customizationData.isOwnedByUser ? (
							<div className="h-full overflow-y-scroll">
								<DrawerTitle className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-3">
									Server Settings
								</DrawerTitle>
								<Material className="grid gap-1 max-h-[700px]">
									<strong>Server Description</strong>
									<p className="mb-3">
										A markdown enabled, fancy description for your server!
										Describe what players will expect from your server and why
										they should join; don't worry, you have more space than
										MOTD's.
									</p>
									{!serverData.loading && (
										<ServerEditorDescription
											defaultMarkdown={
												serverData.server?.customizationData.description ?? ""
											}
										/>
									)}
								</Material>
							</div>
						) : (
							<Placeholder
								icon={<X />}
								className="h-full justify-center flex items-center"
								title="You don't own this server"
								description="Unfortunately, that one ain't gonna work. Atleast not on my watch."
							/>
						)}
					</DrawerContent>
				</Drawer>
			</MilkdownProvider>
		</>
	);
}
