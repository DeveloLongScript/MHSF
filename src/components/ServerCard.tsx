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

import {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuItem,
	ContextMenuContent,
	ContextMenuSeparator,
} from "@/components/ui/context-menu";
import toast, { LoaderIcon } from "react-hot-toast";
import {
	CardHeader,
	CardTitle,
	CardDescription,
	Card,
	CardContent,
} from "./ui/card";
import IconDisplay from "./IconDisplay";
import { TagShower } from "./ServerList";
import {
	ArrowRight,
	ChartArea,
	Copy,
	EllipsisVertical,
	Layers,
	Star,
} from "lucide-react";
import { Button } from "./ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useRouter } from "@/lib/useRouter";
import Link from "next/link";
import { useState } from "react";
import { favoriteServer, isFavorited } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import useClipboard from "@/lib/useClipboard";

export default function ServerCard({ b, motd, mini, favs }: any) {
	const router = useRouter();
	const clipboard = useClipboard();
	const [favoriteStar, setFavoriteStar] = useState(false);
	const [favoriteLoading, setFavoriteLoading] = useState(true);
	const { isSignedIn } = useUser();
	const { resolvedTheme } = useTheme();

	return (
		<ContextMenu
			onOpenChange={(open) => {
				if (open && isSignedIn)
					isFavorited(b.name).then((c) => {
						setFavoriteStar(c);
						setFavoriteLoading(false);
					});
			}}
		>
			<ContextMenuTrigger>
				<Card
					key={b.name}
					className={
						(!mini ? "min-h-[450px] max-h-[450px]" : "") +
						" mb-4 flex items-start shadow-md"
					}
				>
					<CardHeader>
						<CardTitle className="m-0">
							<span>
								<IconDisplay server={b} />
								<HoverCard>
									<HoverCardTrigger asChild>
										<Link href={"/server/" + b.name}>
											<Button
												variant={"link"}
												className="text-2xl px-0 pl-1 font-semibold"
											>
												{b.name}
											</Button>
										</Link>
									</HoverCardTrigger>
									<HoverCardContent className="w-80 font-normal tracking-normal">
										<div className="flex justify-between space-x-4">
											<div className="space-y-1">
												<h4 className="text-sm font-semibold">{b.name}</h4>
												<p className="text-sm">
													{motd && (
														<span
															dangerouslySetInnerHTML={{ __html: motd }}
															className="w-[30px] text-center break-all overflow-hidden"
														/>
													)}
												</p>
												<div className="flex items-center pt-2">
													<span className="text-xs text-muted-foreground flex items-center">
														<ArrowRight size={16} className="mr-2" />
														Open Server Page
													</span>
												</div>
												<div className="flex items-center pt-2">
													<span className="text-xs text-muted-foreground flex items-center">
														<ChartArea size={16} className="mr-2" />
														Running on{" "}
														{b.staticInfo.serverPlan == undefined
															? "Free Plan"
															: b.staticInfo.serverPlan}
													</span>
												</div>
											</div>
										</div>
									</HoverCardContent>
								</HoverCard>
							</span>
							<Drawer>
								<DrawerTrigger>
									<Button
										size="icon"
										className="w-[24px] h-[24px] ml-2 md:hidden"
										variant="secondary"
									>
										<EllipsisVertical size={16} />
									</Button>
								</DrawerTrigger>
								<DrawerContent>
									<DrawerHeader>
										<DrawerTitle>Actions</DrawerTitle>
									</DrawerHeader>
									<DrawerFooter>
										<Button
											variant="ghost"
											onClick={() => {
												clipboard.writeText(b.name + ".mshf.minehut.gg");
												toast.success("Copied IP to clipboard");
											}}
										>
											Copy server IP
											<Copy size={18} className="ml-4" />
										</Button>
										<Button
											variant="ghost"
											onClick={() => {
												router.push("/server/" + b.name);
											}}
										>
											Open server page
										</Button>
									</DrawerFooter>
								</DrawerContent>
							</Drawer>
							{b.author != undefined ? (
								<div className="text-sm text-muted-foreground font-normal tracking-normal">
									by {b.author}
								</div>
							) : (
								<br />
							)}
							<TagShower server={b} />
						</CardTitle>
						<CardDescription className="float-left inline ">
							<span className="flex items-center">
								{b.playerData.playerCount == 0 ? (
									<div
										className="items-center border"
										style={{
											width: ".5rem",
											height: ".5rem",
											borderRadius: "9999px",
										}}
									/>
								) : (
									<div
										className="items-center"
										style={{
											backgroundColor: "#0cce6b",
											width: ".5rem",
											height: ".5rem",
											borderRadius: "9999px",
										}}
									/>
								)}

								<span className="pl-1">
									{b.playerData.playerCount}{" "}
									{b.playerData.playerCount == 1 ? "player" : "players"}{" "}
									currently online {favs && <>• {favs} favorited</>}
								</span>
							</span>

							<ContextMenu>
								<ContextMenuTrigger>
									<>
										<Button
											size="icon"
											variant="secondary"
											className="min-w-[128px] max-w-[328px] h-[32px] mt-2 ml-2 max-md:hidden"
											onClick={() => {
												clipboard.writeText(b.name + ".mshf.minehut.gg");
												toast.success("Copied IP to clipboard");
											}}
										>
											<Copy size={18} />
											<code className="ml-2">{b.name}</code>
										</Button>
										<Tooltip>
											<TooltipTrigger>
												<Link href={"/server/" + b.name}>
													<Button
														size="icon"
														variant="secondary"
														className="w-[32px] h-[32px] mt-2 ml-2 max-md:hidden"
													>
														<Layers size={18} />
													</Button>
												</Link>
											</TooltipTrigger>
											<TooltipContent>
												Open up the server page to see more information about
												the server
											</TooltipContent>
										</Tooltip>
									</>
								</ContextMenuTrigger>
								<ContextMenuContent>
									<ContextMenuItem
										onClick={() => {
											clipboard.writeText(b.name + ".mshf.minehut.gg");
											toast.success("Copied IP to clipboard");
										}}
									>
										Copy server IP
										<div className="RightSlot">
											<Copy size={18} />
										</div>
									</ContextMenuItem>
									<ContextMenuSeparator />
									<Link href={"/server/" + b.name}>
										<ContextMenuItem>Open server page</ContextMenuItem>
									</Link>
								</ContextMenuContent>
							</ContextMenu>
						</CardDescription>
						<CardContent>
							{motd && (
								<span
									dangerouslySetInnerHTML={{ __html: motd }}
									className="w-[30px] text-center break-all overflow-hidden"
								/>
							)}
						</CardContent>
					</CardHeader>
				</Card>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => {
						clipboard.writeText(b.name + ".mshf.minehut.gg");
						toast.success("Copied IP to clipboard");
					}}
				>
					Copy server IP
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem
					onClick={() => {
						router.push("/server/" + b.name);
					}}
				>
					Open server page
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => {
						router.push("/server/" + b.name + "/statistics");
					}}
				>
					Open statistics page
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem
					onClick={() => {
						setFavoriteLoading(true);
						favoriteServer(b.name).then(() => {
							setFavoriteLoading(false);
							setFavoriteStar(!favoriteStar);
						});
					}}
					disabled={!isSignedIn || favoriteLoading}
				>
					{!favoriteLoading && (
						<Star
							size={16}
							className="mr-2 text-white"
							fill={
								favoriteStar
									? resolvedTheme == "dark"
										? "white"
										: "black"
									: "transparent"
							}
						/>
					)}{" "}
					{favoriteLoading && <LoaderIcon className="mr-2" />}
					{favoriteStar && isSignedIn ? "Unf" : "F"}avorite Server
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
