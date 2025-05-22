import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerTitle,
} from "@/components/ui/drawer";
import { type ReactNode, useEffect, useState } from "react";
import { ServerEditorDescription } from "./server-editor-description";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { MilkdownProvider } from "@milkdown/react";
import { Material } from "@/components/ui/material";
import { Placeholder } from "@/components/ui/placeholder";
import { Check, X } from "lucide-react";
import { Link } from "@/components/util/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OnlineServer, ServerResponse } from "@/lib/types/mh-server";
import { useServers } from "@/lib/hooks/use-servers";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";
import type { BannerUploaderRouter } from "@/pages/api/v1/server/get/[server]/settings/upload-banner";
import {
	generateUploadButton,
	generateUploadDropzone,
} from "@uploadthing/react";
import { ServerDescriptionBox } from "./customizations/server-description-box";
import { ServerBannerBox } from "./customizations/server-banner-box";
import { ServerMigrationBox } from "./customizations/server-migration-box";
import { ServerColorModeBox } from "./customizations/server-color-mode-box";
import { MHSFUser, useUser } from "@/lib/hooks/use-user";
import { ServerUnownBox } from "./customizations/server-unown-box";
import { ServerDiscordBox } from "./customizations/server-discord-box";

const successClasses =
	"bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-600";
const errorClasses =
	"bg-red-200 border-red-400 dark:bg-red-800 dark:border-red-600";

export function ServerEditorProvider({
	children,
	serverData,
	minehutData,
	mhsfUser
}: {
	children: ReactNode | ReactNode[];
	serverData: ReturnType<typeof useMHSFServer>;
	minehutData: ServerResponse;
	mhsfUser: {user: MHSFUser | null};
}) {
	const [open, setOpen] = useState(false);
	const [onlineData, setOnlineData] = useState<OnlineServer>();
	const { servers, loading } = useServers();

	useEffect(() => {
		window.addEventListener("open-server-editor", () => {
			setOpen(true);
		});
	}, []);

	useEffect(() => {
		if (open && !loading) {
			const server = servers.find((c) => c.name === minehutData.name);
			if (server !== null) {
				setOnlineData(server);
			}
		}
	}, [open, loading, servers, minehutData.name]);

	const requirementOne = minehutData.online;
	const requirementTwo = onlineData !== null;
	const requirementThree = mhsfUser !== null && mhsfUser.user?.claimedUser !== null && mhsfUser.user?.claimedUser?.name === onlineData?.author;
	const requirementFour = mhsfUser !== null && mhsfUser.user?.claimedUser !== null;

	return (
		<>
			{children}
			<MilkdownProvider>
				<Drawer open={open} onOpenChange={(c) => {
					serverData.refresh();
					setOpen(c);
				}}>
					<DrawerContent className="p-4 !max-h-[700px] !h-[700px]">
						<br />
						{!serverData.server?.customizationData.isOwned ? (
							<div className="h-full overflow-y-scroll">
								<DrawerTitle className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-3">
									Own your server.
								</DrawerTitle>
								<DrawerDescription>
									Own your server to completely control your server and how it
									appears on MHSF.{" "}
									<Link
										href="https://mhsf.mintlify.app/guides/owning-a-server"
										className="text-black dark:text-white"
									>
										Learn more about server owning.
									</Link>
								</DrawerDescription>
								{onlineData?.author === undefined && (
									<Alert variant="error">
										This server cannot be automatically linked as it doesn't
										have an author. You must either contact support to link this
										server or link your Minehut account to your Minecraft: Java
										Edition one.
									</Alert>
								)}
								<div className="mt-2 text-sm">
									<p className="pb-2">
										<code
											className={cn(
												"border rounded-full h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center",
												requirementOne ? successClasses : errorClasses,
											)}
										>
											{requirementOne ? <Check size={16} /> : <X size={16} />}
										</code>
										<span className="ml-[2.25rem] pt-0.5 grid grid-rows-2">
											<strong>Your server must be online.</strong> This is
											required as this is the only way to ensure you are the
											owner of the server.
										</span>
									</p>
									{requirementOne && (
										<>
											<p className="pb-2">
												<code
													className={cn(
														"border rounded-full h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center",
														requirementTwo !== null
															? successClasses
															: errorClasses,
													)}
												>
													{requirementTwo !== null ? (
														<Check size={16} />
													) : (
														<X size={16} />
													)}
												</code>
												<span className="ml-[2.25rem] pt-0.5 grid grid-rows-2">
													<strong>
														Your server must be on the server list.
													</strong>
													This sometimes can't be achieved if the server isn't
													visible or another issue appears.
												</span>
											</p>
											{requirementTwo && (
												<>
													<p className="pb-2">
														<code
															className={cn(
																"border rounded-full h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center",
																requirementThree
																	? successClasses
																	: errorClasses,
															)}
														>
															{requirementThree ? (
																<Check size={16} />
															) : (
																<X size={16} />
															)}
														</code>
														<span className="ml-[2.25rem] pt-0.5 grid grid-rows-2">
															<strong>
																Your account must be linked to{" "}
																<i>{onlineData?.author}</i>
															</strong>
															You must link your MHSF account to your Minecraft:
															Java Edition account that is the owner of this
															server to be able to link this server.
														</span>
													</p>
													<p className="pb-2">
														<code
															className={cn(
																"border rounded-full h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center",
																requirementFour ? successClasses : errorClasses,
															)}
														>
															{requirementFour ? (
																<Check size={16} />
															) : (
																<X size={16} />
															)}
														</code>
														<span className="ml-[2.25rem] pt-0.5 grid grid-rows-2">
															<strong>
																Your account must be linked on MHSF
															</strong>
															You must link your account to your Minecraft: Java
															Edition account to be able to link this server.
														</span>
													</p>
												</>
											)}
										</>
									)}
								</div>
								<DrawerFooter>
									<Button
										onClick={async () => {
											toast.promise(
												async () => {
													await serverData.ownServer();
													await serverData.refresh();
												},
												{
													success: "Successfully owned server",
													error:
														"There was an error while linking this server. Please contact support.",
													loading: "Linking server...",
												},
											);
										}}
										disabled={
											!(
												requirementOne &&
												requirementTwo &&
												requirementThree &&
												requirementFour
											)
										}
									>
										Own Server
									</Button>
								</DrawerFooter>
							</div>
						) : (
							<>
								{serverData.server?.customizationData.isOwnedByUser ? (
									<div className="!max-h-[700px] !h-[700px] overflow-y-scroll">
										{serverData.server?.customizationData
											.customizationVersion === 2 ? (
											<div>
												<DrawerTitle className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-3">
													Server Settings
												</DrawerTitle>
												<ServerDescriptionBox
													serverData={serverData}
													minehutData={minehutData}
												/>
												<ServerBannerBox
													serverData={serverData}
													minehutData={minehutData}
												/>
												<ServerColorModeBox
													serverData={serverData}
													minehutData={minehutData}
												/>
												<ServerDiscordBox mhsfServer={minehutData._id} defaultDiscord={serverData.server.customizationData.discord ?? ""} />
												<ServerUnownBox
													mhsfData={serverData}
													serverData={minehutData}
													reset={() => {setOpen(false); serverData.refresh();}}
												/>
											</div>
										) : (
											<ServerMigrationBox
												oldVersion={1}
												reupdate={() => serverData.refresh()}
												id={minehutData._id}
											/>
										)}
									</div>
								) : (
									<Placeholder
										icon={<X />}
										className="h-full justify-center flex items-center"
										title="You don't own this server"
										description="Unfortunately, that one ain't gonna work. Atleast not on my watch."
									/>
								)}
							</>
						)}
					</DrawerContent>
				</Drawer>
			</MilkdownProvider>
		</>
	);
}
