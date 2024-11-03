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
import { BorderBeam } from "@/components/effects/border-beam";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { allCategories, allTags } from "@/config/tags";
import events from "@/lib/commandEvent";
import ServersList from "@/lib/list";
import { OnlineServer } from "@/lib/types/mh-server";
import useClipboard from "@/lib/useClipboard";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { useRouter } from "@/lib/useRouter";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { ChatBubbleIcon, InputIcon } from "@radix-ui/react-icons";
import {
	ArrowDownZA,
	Check,
	CircleUser,
	ImageIcon,
	Info,
	LogIn,
	Network,
	Sun,
	XIcon,
} from "lucide-react";
import { CommandIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import ClientFadeIn from "./ClientFadeIn";
import IconDisplay from "./IconDisplay";
import ServerCard from "./ServerCard";
import Stat from "./Stat";
import { SignInPopover } from "./clerk/SignInPopoverButton";
import { BentoCard, BentoGrid } from "./effects/bento-grid";
import Marquee from "./effects/marquee";
import Particles from "./effects/particles";
import SparklesText from "./effects/sparkles-text";
import { pageFind } from "./misc/Link";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

const features = [
	{
		Icon: ChatBubbleIcon,
		name: "Add a Discord widget",
		description:
			"Show where your players talk to each-other, including an online users count.",
		href: "/docs/guides/customization",
		cta: "Learn more",
		background: <span />,
		className: "lg:row-start-1 lg:row-end-2 lg:col-start-2 lg:col-end-3",
	},
	{
		Icon: InputIcon,
		name: "Descriptions",
		href: "/docs/guides/customization",
		cta: "Learn more",
		description:
			"Format your descriptions using Markdown to show what your server has to offer.",
		background: <span />,
		className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2",
	},
	{
		Icon: ImageIcon,
		name: "Banners",
		href: "/docs/guides/customization",
		cta: "Learn more",
		description:
			"Show a banner with can contain images that show on your server page.",
		background: <span />,
		className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
	},
];

export default function ServerList() {
	const [loading, setLoading]: any = useState(true);
	const [randomText, setRandomText] = useState("");
	const [motdList, setMotdList] = useState<any>({});
	const allText = [""];
	const getRandomText = () => {
		return allText[Math.floor(Math.random() * allText.length)];
	};
	const [templateFilter, setTemplateFilter] = useState(false);
	const [random, setRandom] = useState(false);
	const [serverList, setServerList] = useState(new ServersList([]));
	const [textCopied, setTextCopied] = useState(false);
	const [padding, setPadding] = useState<string>("0");
	const bigger = async (server: OnlineServer) =>
		server.playerData.playerCount > 15;
	const smaller = async (server: OnlineServer) =>
		!server.staticInfo.alwaysOnline &&
		server.playerData.playerCount < 15 &&
		server.playerData.playerCount > 7;
	const [nameFilters, setNameFilters] = useState<any>({});
	const [inErrState, setErrState] = useState(false);
	const [servers, setServers] = useState<Array<OnlineServer>>([]);
	const clipboard = useClipboard();
	const router = useRouter();
	const { user, isSignedIn } = useUser();
	const [pOS, setpOS] = useState(false);
	const [ipr, setIPR] = useState<string>("4");
	const [am, setAM] = useState(false);
	const [filters, setFilters] = useState<
		Array<(server: OnlineServer) => Promise<boolean>>
	>([]);
	const [randomData, setRandomData] = useState<OnlineServer | undefined>(
		undefined,
	);
	const { resolvedTheme } = useTheme();
	const [color, setColor] = useState("#ffffff");

	useEffect(() => {
		setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	useEffect(() => {
		if (isSignedIn) {
			setAM(true);
			console.log(user.publicMetadata);

			setIPR((user.publicMetadata.ipr as string | undefined) || "4");
			setPadding((user.publicMetadata.pad as string | undefined) || "0");
			setpOS((user.publicMetadata.srv as boolean | undefined) || false);
		}
	}, [isSignedIn, user]);

	useEffectOnce(() => {
		setRandomText(getRandomText());
		serverList
			.fetchDataAndFilter()
			.then(() => {
				serverList.moveListDown();
				let stringList: Array<{ server: string; motd: string }> = [];
				let obj: any = {};

				serverList.currentServers.forEach((b) => {
					stringList.push({ motd: b.motd, server: b.name });
				});

				serverList.getMOTDs(stringList).then((c) => {
					var updatedSL = motdList;
					c.forEach((b: { server: string; motd: string }) => {
						updatedSL[b.server] = b.motd;
					});
					setMotdList(updatedSL);
					setServers(serverList.currentServers);
					setLoading(false);
				});
			})
			.catch(() => setErrState(true));
	});

	const ref = useRef(null);
	const [clickedPage, setClickedPage] = useState("banners");
	const [hero, setHero] = useState(false);
	if (inErrState) {
		return (
			<>
				<div className="flex justify-center">
					<XIcon />
					<br />
				</div>
				<div className="flex justify-center">
					Hmm. Something is wrong. Reload the page.
				</div>
			</>
		);
	}

	if (loading) {
		return (
			<div className="p-4">
				<SignedIn>
					<div className="md:grid md:grid-cols-3 gap-4 max-lg:grid-cols-2">
						<Skeleton className="h-[112px] rounded-xl" />
						<Skeleton className="h-[112px] rounded-xl" />
						<Skeleton className="h-[112px] rounded-xl" />
					</div>
					<br />
					<Separator />
					<br />
					<div className="md:grid md:grid-cols-4 gap-4">
						<Skeleton className="h-[450px] rounded-xl" />
						<Skeleton className="h-[450px] rounded-xl" />
						<Skeleton className="h-[450px] rounded-xl" />
						<Skeleton className="h-[450px] rounded-xl" />
					</div>
				</SignedIn>
			</div>
		);
	}

	return (
		<div style={!pOS ? { padding: `${padding}px` } : undefined}>
			<div className="p-0 branding-hero">
				<>
					{(!isSignedIn || hero) && (
						<div className="pb-[300px] max-lg:pb-[1000px] max-md:pb-[1000px] relative mx-auto mt-20 max-w-7xl text-center md:px-8 ">
							<Particles
								className="absolute inset-0 -z-10 block"
								quantity={100}
								ease={70}
								size={0.05}
								staticity={40}
								color={color}
							/>
							<SparklesText className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-5xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-6xl md:text-7xl lg:text-8xl dark:from-white dark:to-white/40">
								<>
									Meet MHSF, <br className="hidden md:block" /> the modern
									server finder
								</>
							</SparklesText>
							<p className="animate-fade-in mb-12 -translate-y-4 text-balance text-lg tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
								MHSF is the next generation server list for Minehut, with
								interactive filters, <br className="hidden md:block" />{" "}
								intuitive keyboard shortcuts, and everything between.
							</p>

							<Link href="#serverlist">
								<Button className="animate-fade-in -translate-y-4 gap-1 rounded-lg text-white opacity-0 ease-in-out [--animation-delay:600ms] dark:text-black">
									Look and see <ArrowDownZA size={18} />
								</Button>
							</Link>
							<Popover>
								<PopoverTrigger>
									<SignedOut>
										<Button
											variant="outline"
											className="animate-fade-in -translate-y-4 ml-2 gap-1 rounded-lg  opacity-0 ease-in-out [--animation-delay:600ms]"
										>
											Login <LogIn size={18} />
										</Button>
									</SignedOut>
								</PopoverTrigger>
								<PopoverContent className="w-full">
									<SignInPopover />
								</PopoverContent>
							</Popover>
							<div
								ref={ref}
								className="relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]"
							>
								<div
									className={` rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] before:animate-image-glow`}
								>
									<BorderBeam
										size={200}
										duration={12}
										delay={11}
										colorFrom="var(--color-one)"
										colorTo="var(--color-two)"
									/>

									<img
										src="/branding/full-desktop.png"
										alt="Hero Image"
										className="relative hidden size-full rounded-[inherit] border object-contain dark:block"
									/>
									<img
										src="/branding/full-desktop-light.png"
										alt="Hero Image"
										className="relative block size-full rounded-[inherit]  border object-contain dark:hidden"
									/>
								</div>
							</div>
							<br />
							<br />
							<span className="animate-fade-in -translate-y-4 bg-green-400/60 px-4 py-2 rounded">
								For players
							</span>
							<br />
							<br />
							<h1 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-2xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-2xl md:text-3xl lg:text-4xl dark:from-white dark:to-white/40">
								Find what you want now, not later
							</h1>
							<p className="animate-fade-in mb-12 -translate-y-4 text-balance text-lg tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
								Use interactive filters and customization modes to find the
								server of your choice
								<br className="hidden md:block" /> in less than 10 minutes.
							</p>
							<div className="relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background ">
								<Marquee className="[--duration:30s]">
									{serverList.currentServers.slice(0, 20).map((server) => (
										<div
											key={server.name}
											className={cn(
												"relative w-64 cursor-pointer overflow-hidden rounded-xl border no-underline " +
													"border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] " +
													"dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
											)}
											onClick={() =>
												router.push(pageFind(`Server:${server.name}`))
											}
										>
											<div className="items-center gap-2 p-4">
												<div>
													<div
														className={
															"text-lg font-bold dark:text-white" +
															(server.author == undefined ? " mt-2" : "")
														}
													>
														<IconDisplay server={server} className="mr-2" />
														{server.name}
													</div>
													{server.author && (
														<p className="text-sm dark:text-white/40">
															by {server.author}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</Marquee>
								<Marquee reverse className="[--duration:30s]">
									{serverList.currentServers.slice(0, 20).map((server) => (
										<div
											key={server.name}
											className={cn(
												"relative w-64 cursor-pointer overflow-hidden rounded-xl border no-underline " +
													"border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] " +
													"dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
											)}
											onClick={() => router.push(`/server/${server.name}`)}
										>
											<div className="items-center gap-2 p-4">
												<div>
													<div
														className={
															"text-lg font-bold dark:text-white" +
															(server.author == undefined ? " mt-2" : "")
														}
													>
														<IconDisplay server={server} className="mr-2" />
														{server.name}
													</div>
													{server.author && (
														<p className="text-sm dark:text-white/40">
															by {server.author}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</Marquee>
								<div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background" />

								<div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background" />
							</div>
							<br />
							<span className="animate-fade-in -translate-y-4 bg-yellow-400/60 px-4 py-2 rounded">
								For server owners
							</span>
							<br />
							<br />
							<h1 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-2xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-2xl md:text-3xl lg:text-4xl dark:from-white dark:to-white/40">
								Make your server stand out
							</h1>
							<p className="animate-fade-in mb-12 -translate-y-4 text-balance text-lg tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
								Servers can have custom banners, Discord widgets, color schemes,
								and descriptions, making your server stand out with information
								that can be shown to players.
							</p>
							<BentoGrid className="max-h-[100px]">
								{features.map((feature, idx) => (
									<BentoCard key={idx} {...feature} />
								))}
							</BentoGrid>

							<Separator />
						</div>
					)}
					<br />
				</>
			</div>
			<div className="p-4">
				<ClientFadeIn id="serverlist">
					<div className="max-lg:grid-cols-2 grid grid-cols-3 gap-4">
						<Stat
							title="Players online"
							desc={serverList.getExtraData().total_players.toString()}
							icon={CircleUser}
						/>
						<Stat
							title={
								<div
									className={
										serverList.getExtraData().total_servers >= 3200
											? "bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500"
											: ""
									}
								>
									Servers online{" "}
								</div>
							}
							className="relative z-0"
							desc={
								<div className="flex items-center">
									<div
										className={
											serverList.getExtraData().total_servers >= 3200
												? "bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 "
												: ""
										}
									>
										{serverList.getExtraData().total_servers.toString()}
									</div>
									{serverList.getExtraData().total_servers >= 3200 && (
										<Tooltip>
											<TooltipTrigger>
												<Info size={16} className="ml-2" />
											</TooltipTrigger>
											<TooltipContent className="font-normal">
												The server amount is over 3.2k, meaning that new servers
												have to go into a queue before being able to be online.{" "}
												<br />
												(the server count isn't entirely accurate, so sometimes
												you might not go into a queue even when the server count
												is at 3.2k)
											</TooltipContent>
										</Tooltip>
									)}
								</div>
							}
							icon={Network}
						>
							{serverList.getExtraData().total_servers >= 3200 && (
								<BorderBeam
									size={135}
									duration={12}
									delay={9}
									colorFrom="rgb(6 182 212)"
									colorTo="rgb(59 130 246)"
								/>
							)}
						</Stat>
						<Stat
							title="Current most popular server (in filter)"
							className="max-lg:col-span-2"
							desc={
								<>
									{serverList.currentServers[0] != undefined
										? serverList.currentServers[0].name
										: "None"}{" "}
									{serverList.currentServers[0] != undefined && (
										<IconDisplay server={serverList.currentServers[0]} />
									)}
								</>
							}
							icon={Sun}
						/>
					</div>
				</ClientFadeIn>
				<br id="serverlist" className="pb-14" />
				<Separator />
				<ClientFadeIn delay={100}>
					<Menubar className="mt-3 ml-2 border rounded p-2 shadow">
						<MenubarMenu>
							<MenubarTrigger>Servers</MenubarTrigger>
							<MenubarContent>
								<MenubarItem
									onSelect={() => events.emit("search-request-event")}
								>
									Search Servers
									<MenubarShortcut className="flex items-center ml-3">
										<CommandIcon size={14} />
										+Shift+K
									</MenubarShortcut>
								</MenubarItem>
								<MenubarItem
									onSelect={() => {
										setRandomData(serverList.getRandomServer());
										setRandom(true);
									}}
								>
									Pick Random Server
								</MenubarItem>
								<MenubarSeparator />
								<MenubarItem
									onSelect={() => {
										toast.promise(
											new Promise((s, e) => {
												setLoading(true);
												serverList
													.fetchDataAndFilter()
													.then(() => {
														serverList.moveListDown();

														let stringList: Array<{
															server: string;
															motd: string;
														}> = [];
														let obj: any = {};

														serverList.currentServers.forEach((b) => {
															stringList.push({ motd: b.motd, server: b.name });
														});

														serverList.getMOTDs(stringList).then((c) => {
															var updatedSL = motdList;
															c.forEach(
																(b: { server: string; motd: string }) => {
																	updatedSL[b.server] = b.motd;
																},
															);
															setMotdList(updatedSL);
															setServers(serverList.currentServers);
															setLoading(false);
															s(false);
														});
													})
													.catch(() => {
														e();
													});
											}),
											{
												success: "Succesfully refreshed servers",
												loading: "Refreshing...",
												error: "Error while refreshing",
											},
										);
									}}
								>
									Refresh
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>Filter</MenubarTrigger>
							<MenubarContent className="max-h-[400px] overflow-auto">
								<MenubarRadioGroup
									onValueChange={(v) => {
										toast.promise(
											new Promise((g, b) => {
												if (v == "smaller") {
													setTemplateFilter(true);
													var filt = nameFilters;
													filt["smaller-tf"] = true;
													filt["bigger-tf"] = false;
													setNameFilters(filt);

													var filt2 = filters;
													filt2.push(smaller);
													if (filt2.includes(bigger)) {
														filt2.splice(filt2.indexOf(bigger), 1);
													}
													setFilters(filt2);
													serverList.editFilters(filters);
													serverList.fetchDataAndFilter().then(() => {
														serverList.moveListDown();

														let stringList: Array<{
															server: string;
															motd: string;
														}> = [];
														let obj: any = {};

														serverList.currentServers.forEach((b) => {
															stringList.push({ motd: b.motd, server: b.name });
														});

														serverList.getMOTDs(stringList).then((c) => {
															var updatedSL = motdList;
															c.forEach(
																(b: { server: string; motd: string }) => {
																	updatedSL[b.server] = b.motd;
																},
															);
															setMotdList(updatedSL);
															setServers(serverList.currentServers);
															g(undefined);
														});
													});
												} else if (v == "bigger") {
													setTemplateFilter(true);
													var filt = nameFilters;
													filt["smaller-tf"] = false;
													filt["bigger-tf"] = true;
													setNameFilters(filt);
													var filt2 = filters;
													filt2.push(bigger);

													filt2.splice(filt2.indexOf(smaller), 1);

													setFilters(filt2);
													serverList.editFilters(filters);

													serverList.fetchDataAndFilter().then(() => {
														serverList.moveListDown();

														let stringList: Array<{
															server: string;
															motd: string;
														}> = [];
														let obj: any = {};

														serverList.currentServers.forEach((b) => {
															stringList.push({ motd: b.motd, server: b.name });
														});

														serverList.getMOTDs(stringList).then((c) => {
															var updatedSL = motdList;
															c.forEach(
																(b: { server: string; motd: string }) => {
																	updatedSL[b.server] = b.motd;
																},
															);
															setMotdList(updatedSL);
															setServers(serverList.currentServers);
															g(undefined);
														});
													});
												} else {
													var filt = nameFilters;
													filt["smaller-tf"] = false;
													filt["bigger-tf"] = false;
													setNameFilters(filt);
													setTemplateFilter(false);

													var filt2 = filters;
													filt2.splice(filt2.indexOf(smaller), 1);
													filt2.splice(filt2.indexOf(bigger), 1);
													setFilters(filt2);
													console.log(filters, filters.includes(smaller));
													serverList.editFilters(filters);

													serverList.fetchDataAndFilter().then(() => {
														serverList.moveListDown();

														let stringList: Array<{
															server: string;
															motd: string;
														}> = [];
														let obj: any = {};

														serverList.currentServers.forEach((b) => {
															stringList.push({ motd: b.motd, server: b.name });
														});

														serverList.getMOTDs(stringList).then((c) => {
															var updatedSL = motdList;
															c.forEach(
																(b: { server: string; motd: string }) => {
																	updatedSL[b.server] = b.motd;
																},
															);
															setMotdList(updatedSL);
															setServers(serverList.currentServers);
															g(undefined);
														});
													});
												}
											}),
											{
												error: "Error while changing filters",
												loading: "Changing filters...",
												success: "Changed filters!",
											},
										);
									}}
									value={(() => {
										if (nameFilters["smaller-tf"]) {
											return "smaller";
										} else if (nameFilters["bigger-tf"]) {
											return "bigger";
										} else {
											return "none";
										}
									})()}
								>
									<MenubarRadioItem value="smaller">
										<div className="block">
											Only allow smaller servers
											<br />
											<span className="text-sm text-muted-foreground">
												Only allow servers that have the player range 7-15, and
												cannot <br />
												be Always Online.
											</span>
										</div>
									</MenubarRadioItem>
									<MenubarRadioItem value="bigger">
										<div className="block">
											Only allow bigger servers
											<br />
											<span className="text-sm text-muted-foreground">
												Only allow servers with more than 15 players.
											</span>
										</div>
									</MenubarRadioItem>
									<MenubarRadioItem value="none">
										No/custom requirements
									</MenubarRadioItem>
								</MenubarRadioGroup>
								<MenubarSeparator />
								<MenubarSub>
									<span className="text-sm text-muted-foreground ml-2">
										Tags
									</span>
								</MenubarSub>
								{allTags.map((tag) => (
									<div key={tag.docsName}>
										{tag.docsName && tag.__filter == undefined && (
											<MenubarCheckboxItem
												disabled={templateFilter && tag.__disab != undefined}
												id={tag.docsName}
												checked={(() => {
													return nameFilters["t-" + tag.docsName];
												})()}
												onCheckedChange={async (b) => {
													var filt = nameFilters;
													filt["t-" + tag.docsName] = b;
													setNameFilters(filt);
													if (b) {
														var filt2 = filters;
														filt2.push(tag.condition);
														setFilters(filt2);
													} else {
														var filt2 = filters;
														filt2.splice(filt2.indexOf(tag.condition), 1);
														setFilters(filt2);
													}
													serverList.editFilters(filters);
													serverList.fetchDataAndFilter().then(() => {
														serverList.moveListDown();

														let stringList: Array<{
															server: string;
															motd: string;
														}> = [];
														let obj: any = {};

														serverList.currentServers.forEach((b) => {
															stringList.push({ motd: b.motd, server: b.name });
														});

														serverList.getMOTDs(stringList).then((c) => {
															var updatedSL = motdList;
															c.forEach(
																(b: { server: string; motd: string }) => {
																	updatedSL[b.server] = b.motd;
																},
															);
															setMotdList(updatedSL);
															setServers(serverList.currentServers);
														});
													});
												}}
											>
												<Badge variant={tag.role} className="mr-1">
													{tag.docsName}
												</Badge>
											</MenubarCheckboxItem>
										)}
									</div>
								))}
								<MenubarSeparator />
								<MenubarSub>
									<span className="text-sm text-muted-foreground ml-2">
										Categories
									</span>
								</MenubarSub>
								{allCategories.map((categorie) => (
									<MenubarCheckboxItem
										id={categorie.name}
										key={categorie.name}
										onCheckedChange={async (b) => {
											var filt = nameFilters;
											filt["c-" + categorie.name] = b;
											setNameFilters(filt);
											if (b) {
												var filt2 = filters;
												filt2.push(categorie.condition);
												setFilters(filt2);
											} else {
												var filt2 = filters;
												filt2.splice(filt2.indexOf(categorie.condition), 1);
												setFilters(filt2);
											}
											serverList.editFilters(filters);
											serverList.fetchDataAndFilter().then(() => {
												serverList.moveListDown();

												let stringList: Array<{
													server: string;
													motd: string;
												}> = [];
												let obj: any = {};

												serverList.currentServers.forEach((b) => {
													stringList.push({ motd: b.motd, server: b.name });
												});

												serverList.getMOTDs(stringList).then((c) => {
													var updatedSL = motdList;
													c.forEach((b: { server: string; motd: string }) => {
														updatedSL[b.server] = b.motd;
													});
													setMotdList(updatedSL);
													setServers(serverList.currentServers);
												});
											});
										}}
										checked={(() => {
											return nameFilters["c-" + categorie.name];
										})()}
									>
										<Badge variant={categorie.role} className="mr-1">
											{categorie.name}
										</Badge>
									</MenubarCheckboxItem>
								))}
							</MenubarContent>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>View</MenubarTrigger>
							<MenubarContent>
								<MenubarSub>
									<MenubarSubTrigger>Grid</MenubarSubTrigger>
									<MenubarSubContent>
										<MenubarRadioGroup
											value={ipr}
											onValueChange={(v) => {
												if (am)
													toast(
														<span>
															These settings will not change over reloads
															because you have account specific options enabled
															<Button
																variant="link"
																className="p-0 m-0"
																onClick={() =>
																	router.push("/account/settings/options")
																}
															>
																Change your preferences
															</Button>
														</span>,
														{ icon: "!" },
													);
												setIPR(v);
											}}
										>
											<MenubarRadioItem value="4">
												4 items per row
											</MenubarRadioItem>
											<MenubarRadioItem value="5">
												5 items per row
											</MenubarRadioItem>
											<MenubarRadioItem value="6">
												6 items per row
											</MenubarRadioItem>
										</MenubarRadioGroup>
									</MenubarSubContent>
								</MenubarSub>
								<MenubarSub>
									<MenubarSubTrigger>Padding</MenubarSubTrigger>
									<MenubarSubContent>
										<MenubarRadioGroup
											value={padding.toString()}
											onValueChange={(v) => {
												if (am)
													toast(
														<span>
															These settings will not change over reloads
															because you have account specific options enabled
															<Button
																variant="link"
																className="p-0 m-0"
																onClick={() =>
																	router.push("/account/settings/options")
																}
															>
																Change your preferences
															</Button>
														</span>,
														{ icon: "!" },
													);
												setPadding(v);
											}}
										>
											<MenubarRadioItem value="0">Default</MenubarRadioItem>
											<MenubarSeparator />
											<MenubarRadioItem value="15">15px</MenubarRadioItem>
											<MenubarRadioItem value="30">30px</MenubarRadioItem>
											<MenubarRadioItem value="40">40px</MenubarRadioItem>
											<MenubarRadioItem value="60">60px</MenubarRadioItem>
											<MenubarRadioItem value="100">100px</MenubarRadioItem>
											<MenubarRadioItem value="200">200px</MenubarRadioItem>
										</MenubarRadioGroup>
										<MenubarSeparator />
										<MenubarCheckboxItem checked={pOS} onCheckedChange={setpOS}>
											Only use padding on servers
										</MenubarCheckboxItem>
									</MenubarSubContent>
								</MenubarSub>
								<MenubarSub>
									<MenubarSubTrigger>Sort</MenubarSubTrigger>
									<MenubarSubContent>
										<MenubarRadioGroup
											value="joins"
											onValueChange={(c) => {
												if (c === "favorites") router.push("/sort/favorites");
											}}
										>
											<MenubarRadioItem value="joins">
												Players Online
											</MenubarRadioItem>
											<MenubarRadioItem value="favorites">
												Favorites
											</MenubarRadioItem>
										</MenubarRadioGroup>
									</MenubarSubContent>
								</MenubarSub>
								<MenubarSeparator />
								<SignedIn>
									<MenubarCheckboxItem checked={hero} onCheckedChange={setHero}>
										Show Hero
									</MenubarCheckboxItem>
								</SignedIn>
								<MenubarItem onClick={() => router.push("/docs")}>
									View the docs
								</MenubarItem>
								{am && (
									<MenubarItem
										onClick={() => router.push("/account/settings")}
										className="block"
									>
										Using saved settings in Preferences
										<br />
										<span className="text-muted-foreground text-xs">
											Your using settings stored on your account, that are not
											temporary.
										</span>
									</MenubarItem>
								)}
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</ClientFadeIn>

				<Dialog open={random} onOpenChange={setRandom}>
					<DialogContent>
						{randomData == undefined && <>No data to randomize</>}
						{randomData != undefined && (
							<DialogHeader>
								<DialogTitle>
									<IconDisplay server={randomData} /> {randomData.name}
									{randomData.author != undefined ? (
										<div className="text-sm text-muted-foreground">
											by {randomData.author}
										</div>
									) : (
										<br />
									)}
									<TagShower server={randomData} />
								</DialogTitle>
								<DialogDescription className="float-left inline">
									<span className="flex items-center">
										{randomData.playerData.playerCount == 0 ? (
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
											{randomData.playerData.playerCount}{" "}
											{randomData.playerData.playerCount == 1
												? "player"
												: "players"}{" "}
											currently online
										</span>
									</span>
									<br />
									<strong>Server IP</strong>
									<br />
									<br />
									<code className="border p-3 rounded">
										{randomData.name}.minehut.gg{" "}
										<Button
											size="icon"
											className="ml-1 h-[20px]"
											onClick={() => {
												setTextCopied(true);
												clipboard.writeText(
													randomData.name + ".mshf.minehut.gg",
												);
												toast.success("Copied!");
												setTimeout(() => setTextCopied(false), 1000);
											}}
										>
											{textCopied ? (
												<Check size={16} className="flex items-center" />
											) : (
												<p>Copy</p>
											)}
										</Button>
									</code>
								</DialogDescription>
							</DialogHeader>
						)}
					</DialogContent>
				</Dialog>

				<br />
				<InfiniteScroll
					dataLength={serverList.currentServers.length}
					hasMore={serverList.hasMore}
					next={() => {
						serverList.moveListDown();
						let stringList: Array<{ server: string; motd: string }> = [];
						serverList.currentServers.forEach((b) => {
							stringList.push({ motd: b.motd, server: b.name });
						});

						serverList.getMOTDs(stringList).then((c) => {
							var updatedSL = motdList;
							c.forEach((b: { server: string; motd: string }) => {
								updatedSL[b.server] = b.motd;
							});
							setMotdList(updatedSL);
							setServers(serverList.currentServers);
							setLoading(false);
						});
					}}
					loader={<Spinner className="flex items-center" />}
					endMessage={
						<p
							style={{ textAlign: "center" }}
							dangerouslySetInnerHTML={{
								__html:
									randomText + "<br /> <strong>You've seen it all</strong>",
							}}
						/>
					}
					style={{
						overflow: "hidden !important",
						paddingLeft: pOS ? `${padding}px` : 6,
						paddingRight: pOS ? `${padding}px` : 6,
					}}
				>
					<ClientFadeIn delay={200}>
						{/** This looks stupid, but its the only way that works */}
						<div
							className={
								" sm:grid " +
								(ipr == "4"
									? "lg:grid-cols-4"
									: ipr == "5"
										? "lg:grid-cols-5"
										: ipr == "6"
											? "lg:grid-cols-6"
											: "") +
								" gap-4 sm:grid-cols-2"
							}
						>
							{servers.map((b: any) => (
								<>
									<ServerCard b={b} motd={motdList[b.name]} />
								</>
							))}
						</div>
					</ClientFadeIn>
				</InfiniteScroll>
			</div>
		</div>
	);
}

export function TagShower(props: {
	server: OnlineServer;
	className?: string;
	unclickable?: boolean;
}) {
	const [loading, setLoading] = useState(true);
	const [compatiableTags, setCompatiableTags] = useState<
		Array<{
			name: string;
			docsName?: string;
			tooltip: string;
			htmlDocs: string;
			role:
				| "default"
				| "destructive"
				| "outline"
				| "secondary"
				| "red"
				| "orange"
				| "yellow"
				| "green"
				| "lime"
				| "blue"
				| "teal"
				| "cyan"
				| "violet"
				| "indigo"
				| "purple"
				| "fuchsia"
				| "pink";
		}>
	>([]);

	useEffectOnce(() => {
		if (loading) {
			allTags.forEach((tag) => {
				tag.condition(props.server).then((b) => {
					if (b && tag.primary) {
						tag.name(props.server).then((n) => {
							compatiableTags.push({
								name: n,
								docsName: tag.docsName,
								tooltip: tag.tooltipDesc,
								htmlDocs: tag.htmlDocs,
								role: tag.role == undefined ? "secondary" : tag.role,
							});
							setLoading(false);
						});
					}
				});
			});
		}
	});

	if (loading) {
		return <></>;
	}

	return (
		<div className="font-normal tracking-normal">
			{compatiableTags.map((t) => (
				<>
					{props.unclickable && (
						<Badge variant={t.role} className={props.className}>
							{t.name}
						</Badge>
					)}
					{!props.unclickable && (
						<Dialog key={t.name}>
							<DialogTrigger>
								<Tooltip>
									<TooltipTrigger>
										<Badge variant={t.role} className={props.className}>
											{t.name}
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										<div className="font-normal">
											{t.tooltip}
											<br />
											Click the tag to learn more about it.
										</div>
									</TooltipContent>
								</Tooltip>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										{'"'}
										{t.docsName == undefined ? t.name : t.docsName}
										{'"'} documentation
									</DialogTitle>
									<DialogDescription
										dangerouslySetInnerHTML={{
											__html: t.htmlDocs,
										}}
									/>
								</DialogHeader>
							</DialogContent>
						</Dialog>
					)}
				</>
			))}
		</div>
	);
}
