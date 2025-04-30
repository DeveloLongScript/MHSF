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

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClerk, useUser } from "@clerk/nextjs";
import { ArrowDown, GalleryVertical, Star } from "lucide-react";
import { useTheme } from "@/lib/hooks/use-theme";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Gradient } from "stripe-gradient";
import { Material } from "@/components/ui/material";
import { Badge } from "@/components/ui/badge";
import { AuroraText } from "./aurora-text";
import { AnimatedList } from "./animated-list";
import { cn } from "@/lib/utils";
import { ExampleChart } from "./example-chart";
import { Link } from "@/components/util/link";
import { type Avatar, AvatarCircles } from "./avatar-circles";
import { Ripple } from "./ripple";
import { FontChanger } from "./font-changer";
import { FlickeringGrid } from "./flickering-grid";
import { DiscordWordmark } from "@/components/ui/discord";
import { Separator } from "@/components/ui/separator";
import { LineShadowText } from "@/components/feat/home-page/line-shadow-text";
import { FlipText } from "./flip-text";
import { InteractiveHoverButton } from "./interactive-hover-button";

const getGitHubDetails = async () => {
	const githubRepo = await (
		await fetch("https://api.github.com/repos/DeveloLongScript/mhsf")
	).json();
	const githubStargazers = await (
		await fetch("https://api.github.com/repos/DeveloLongScript/mhsf/stargazers")
	).json();

	return {
		stars: githubRepo.stargazers_count as number,
		stargazers: (
			githubStargazers as Array<{ avatar_url: string; html_url: string }>
		).map((c) => {
			return { imageUrl: c.avatar_url, profileUrl: c.html_url };
		}),
	};
};

export default function HomePageComponent() {
	const clerk = useClerk();
	const router = useRouter();
	const { isSignedIn } = useUser();
	const theme = useTheme();
	const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";
	const { resolvedTheme } = useTheme();
	const [stars, setStars] = useState(0);
	const [stargazers, setStargazers] = useState<Avatar[]>([]);
	const [gradientId, setGradientId] = useState("gradient-banner");

	useEffect(() => {
		setGradientId("gradient-banner");
		const gradient = new Gradient();
		gradient.initGradient(`#${gradientId}`);
	}, [gradientId]);

	useEffect(() => {
		getGitHubDetails().then((c) => {
			setStars(c.stars);
			setStargazers(c.stargazers);
		});
	}, []);

	return (
		<div className="lg:pt-10">
			<canvas
				id={gradientId}
				// Slightly outside of container to give a REALLY nice glow effect
				className="md:w-[calc(100vw-206px)] max-md:w-full md:pl-50 h-[610px] absolute blur-sm border-b z-1 opacity-0 animate-fade-in [--animation-delay:800ms]"
				style={
					{
						"--gradient-color-1":
							resolvedTheme === "dark" ? "#470061" : "#610034",
						"--gradient-color-2":
							resolvedTheme === "dark" ? "#001299" : "#700099",
						"--gradient-color-3":
							resolvedTheme === "dark" ? "#8d00eb" : "#eb00ac",
						"--gradient-color-4":
							resolvedTheme === "dark" ? "#009de0" : "#0007e0",
						webKitMaskImage:
							"linear-gradient(to top, black, black, transparent)",
						maskImage: "linear-gradient(to top, black, black, transparent)",
					} as React.CSSProperties
				}
				height="64"
				width={window.screen.width}
			/>
			<div className="border p-[72px] dark:bg-grid-white/[0.2] bg-grid-black/[0.2] md:w-[calc(100vw-400px)] mx-auto relative z-9 min-h-[600px]">
				<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-[rgb(10,10,10)] bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] " />

				<h1 className="bg-clip-text animate-fade-in -translate-y-4 bg-gradient-to-br from-black from-30% to-black/40 pb-6 text-5xl font-semibold tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-5xl md:text-6xl lg:text-7xl dark:from-white dark:to-white/40">
					The missing half of{" "}
					<LineShadowText shadowColor="#407ce5" className="text-[#488aff]">
						Minehut
					</LineShadowText>
				</h1>
				<p className="animate-fade-in mb-12 -translate-y-4 text-balance text-lg tracking-tight text-neutral-400 opacity-0 [--animation-delay:400ms] md:text-xl ">
					MHSF is the next generation Minehut server list wrapper, with <br />
					interactive filters, customizable web-pages, a modern interface and{" "}
					<br /> everything in-between.
				</p>

				<span className="flex items-center gap-2 -translate-y-4">
					<Button
						onClick={() => router.push("/servers")}
						className="animate-fade-in opacity-0 [--animation-delay:600ms] flex items-center gap-2"
					>
						<GalleryVertical size={16} />
						Find a server
					</Button>
					<Button
						variant="secondary"
						onClick={() => clerk.openSignUp()}
						disabled={isSignedIn}
					>
						Sign up
					</Button>
				</span>
			</div>
			<br className="md:hidden" />
			<span className="w-full flex flex-col items-center justify-center max-lg:hidden">
				<section className="md:w-[calc(100vw-400px)] border">
					<section className="border-b pb-25">
						<br />
						<br />
						<br />
						<br />
						<p className="text-center w-full font-bold justify-center text-sm flex items-center gap-2">
							An open-source unofficial project brought to you by{" "}
							<Link
								href="https://giftedly.dev"
								className="flex gap-1 items-center"
							>
								<img
									src="https://avatars.githubusercontent.com/u/52332868?v=4"
									className="w-[24px] h-[24px] rounded-full border"
								/>
								dvelo
							</Link>
						</p>
					</section>
					<div className="flex items-center justify-center border-b text-shadcn-primary/5 min-h-[50px] z-0">
						<Badge className="animate-fade-in my-2 rounded-xl px-4 py-2 relative z-1 text-shadcn-primary">
							For server hunters
						</Badge>
					</div>
					<section className="flex border-b">
						<div className="md:flex hidden border-r w-[50px] h-[500px] text-shadcn-primary/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] " />
						<span className="mt-15 md:flex md:justify-between md:items-center px-8 w-full">
							<span>
								<h1 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-2xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-2xl md:text-3xl lg:text-4xl dark:from-white dark:to-white/40">
									Find what you want now. <br />
									<AuroraText>Not later.</AuroraText>
								</h1>
								<p className="animate-fade-in mb-12 -translate-y-4 text-balance text-md tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
									MHSF is built for finding servers, and only that, along with{" "}
									<br />
									allowing for maximum customizability with <br />
									both your experience and the webpages you interact with.{" "}
									<br />
								</p>
							</span>
							<Material className="w-[450px] h-[320px] p-0 relative">
								{" "}
								<img
									src={`/branding/section-1/filter-demo-${theme.resolvedTheme}.png`}
									className="absolute bottom-0 right-0 rounded-br-lg"
									alt="Filter Demo"
								/>{" "}
							</Material>
						</span>
						<div className="border-l md:flex hidden w-[50px] h-[500px] text-shadcn-primary/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] " />
					</section>
					<section className="md:flex mt-15 md:justify-center md:items-center px-8 w-full text-center border-b">
						<span>
							<h1 className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-2xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-2xl md:text-3xl lg:text-4xl dark:from-white dark:to-white/40">
								Build your <AuroraText>dream</AuroraText> server list
							</h1>
							<p className="animate-fade-in mb-6 mt-6 -translate-y-4 text-balance text-md tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
								Server lists are massive. Using custom filters and sorting
								systems <br />
								allow you to shrink the amount of information you see in the way{" "}
								<br />
								<strong>you</strong> want it.
							</p>
						</span>
					</section>
					<section className="flex w-full">
						<div className="lg:flex hidden border-r w-[50px] h-[350px] text-shadcn-primary/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] " />
						<div className="lg:grid grid-cols-3 max-h-[350px] max-lg:h-full w-full">
							<Material className="border-0 relative p-0! max-h-[350px] overflow-hidden rounded-none bg-transparent! hover:bg-white! hover:dark:bg-zinc-900! max-lg:h-[200px] transition-all">
								<AnimatedList className="p-4">
									{Array.from({ length: 100 }, () => [
										{ name: "Cannot find name 'flse'.", code: "2304" },
										{
											name: "Type 'string' is not assignable to type 'boolean'.",
											code: "2322",
										},
										{
											name: "'mhsf' has no exported member named 'Mincehut'. Did you mean 'Minehut'?",
											code: "2724",
										},
										{ name: "Cannot find namespace 'React'.", code: "2503" },
										{
											name: "'server' is declared but its value is never read.",
											code: "6133",
										},
										{
											name: "This comparison appears to be unintentional because the types 'string' and 'boolean' have no overlap",
											code: "2367",
										},
									])
										.reverse()
										.flat()
										.map((c) => (
											<TypeScriptError name={c.name} code={c.code} />
										))}
								</AnimatedList>

								<span className="mt-auto absolute bottom-0 backdrop-blur-lg px-4 pt-2">
									<strong className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] dark:from-white dark:to-white/40">
										Type-safety across the board
									</strong>
									<p className="animate-fade-in mb-6 text-balance tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms]">
										Completely safe TypeScript code is easily achieveable when
										using MHSF custom modification with fully functioning
										TypeScript error detection.
									</p>
								</span>
							</Material>
							<Material className="border-0 p-4 relative rounded-none border-r border-l bg-transparent! hover:bg-white! hover:dark:bg-zinc-900! max-lg:h-[200px] transition-all">
								<img
									src={`/branding/section-2/alert-demo-${theme.resolvedTheme}.png`}
									className="flex justify-center max-lg:hidden rounded-lg "
									alt="Alert Demo"
									width={340}
									height={200}
								/>

								<span className="mt-auto absolute bottom-0 backdrop-blur-lg">
									<strong className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] dark:from-white dark:to-white/40">
										Lint your code instantly
									</strong>
									<p className="animate-fade-in mb-6 text-balance tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms]">
										Worried your code is broken? Run a simulation of your
										modification or lint it very quickly.
									</p>
								</span>
							</Material>
							<Material className="pl-4 relative border-0 rounded-none bg-transparent! hover:bg-white! hover:dark:bg-zinc-900! max-lg:h-[200px] transition-all">
								<img
									src={`/branding/section-2/interactive-demo-${theme.resolvedTheme}.png`}
									className="absolute bottom-[70px] right-0 max-lg:hidden rounded"
									alt="Interactive Demo"
									width={340}
									height={200}
								/>

								<span className="mt-auto absolute bottom-0 backdrop-blur-lg">
									<strong className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] dark:from-white dark:to-white/40">
										Interactively edit your code
									</strong>
									<p className="animate-fade-in mb-6 text-balance tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms]">
										MHSF uses the Monaco Editor as the editor of choice for all
										custom modifications; the same editor that powers the Visual
										Studio Code editor.
									</p>
								</span>
							</Material>
						</div>
						<div className="border-l lg:flex hidden w-[50px] h-[350px] text-shadcn-primary/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] " />
					</section>
					<div className="flex items-center justify-center border-y text-shadcn-primary/5 min-h-[50px] z-0">
						<Badge className="animate-fade-in my-2 rounded-xl px-4 py-2 relative z-1 text-shadcn-primary">
							For data hunters
						</Badge>
					</div>
					<section className="block mt-15 px-8 w-full text-center border-b">
						<span>
							<h1 className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-2xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-2xl md:text-3xl lg:text-4xl dark:from-white dark:to-white/40">
								Your data? <AuroraText>No problem.</AuroraText>
							</h1>
							<p className="animate-fade-in mb-6 mt-6 -translate-y-4 text-balance text-md tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
								Data for servers are openly accessible behind no paywall or{" "}
								<br />
								verification for thousands of servers over millions of total{" "}
								<br />
								entries.
							</p>
						</span>
						<div className="w-full">
							<ExampleChart />
						</div>
						<br />
					</section>
					<section className="md:flex relative overflow-hidden h-[500px] md:justify-center md:items-center px-8 w-full text-center border-b">
						<span>
							<h1 className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-2xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-2xl md:text-3xl lg:text-4xl dark:from-white dark:to-white/40">
								Don't trust us? <AuroraText>We're open-source.</AuroraText>
							</h1>
							<p className="animate-fade-in mb-6 mt-6 -translate-y-4 text-balance text-md tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
								MHSF's entire codebase from microservice to frontend is <br />
								completely open-source under the MIT License.
							</p>
							<span className="flex items-center justify-center gap-2">
								<Link href="Special:GitHub">
									<Button size="lg">Check it out!</Button>
								</Link>
								<span className="flex items-center gap-2 border rounded-lg px-2 py-1">
									<Star size={16} />
									<AvatarCircles numPeople={stars} avatarUrls={stargazers} />
								</span>
							</span>
							<br />
						</span>
						<Ripple mainCircleSize={700} />
					</section>
					<div className="flex items-center justify-center border-b text-shadcn-primary/5 min-h-[50px] z-0">
						<Badge className="animate-fade-in my-2 rounded-xl px-4 py-2 relative z-1 text-shadcn-primary">
							For server <AuroraText>owners</AuroraText>
						</Badge>
					</div>
					<section className="md:flex mt-15 md:justify-center md:items-center px-8 w-full text-center border-b">
						<span>
							<h1 className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 text-2xl font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-2xl md:text-3xl lg:text-4xl dark:from-white dark:to-white/40">
								Showcase <FontChanger>your server</FontChanger>
							</h1>
							<p className="animate-fade-in mb-6 mt-6 -translate-y-4 text-balance text-md tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
								Make your server stand out from the crowd with options to <br />
								display what your server is.
							</p>
						</span>
					</section>
					<section className="flex w-full border-b">
						<div className="lg:flex hidden border-r w-[50px] h-[350px] text-shadcn-primary/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] " />
						<div className="lg:grid grid-cols-3 max-h-[350px] max-lg:h-full w-full">
							<Material className="border-0 relative p-0! max-h-[350px] overflow-hidden rounded-none bg-transparent! hover:bg-white! hover:dark:bg-zinc-900! max-lg:h-[200px] transition-all">
								<img
									src="https://i.imgur.com/5dUxh0c.png"
									style={{
										maskImage: "linear-gradient(to top, transparent, black)",
									}}
								/>
								<span className="mt-auto absolute bottom-0 backdrop-blur-lg px-4 pt-2">
									<strong className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] dark:from-white dark:to-white/40">
										Show. Not tell.
									</strong>
									<p className="animate-fade-in mb-6 text-balance tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms]">
										Use a static banner that can show what your server is about.
									</p>
								</span>
							</Material>
							<Material className="border-0 p-4 relative rounded-none border-r border-l bg-transparent! hover:bg-white! hover:dark:bg-zinc-900! max-lg:h-[200px] transition-all">
								<div className="h-[calc(100%-100px)] w-[calc(100%-32px)] mx-4 my-2 rounded-lg bg-[#5865F2] max-2xl:hidden">
									<span className="flex items-center justify-between text-white p-4">
										<DiscordWordmark fill="white" className="h-[16px]" />
										<Separator orientation="vertical" />
										<span>
											<strong>300k+</strong> online currently
										</span>
									</span>
									<div className="bg-[#454FBF] h-[calc(100%-50px)] w-full p-4 rounded-lg grid">
										<Skeleton className="w-full h-[20px]" />
										<Skeleton className="w-full h-[20px]" />
										<Skeleton className="w-full h-[20px]" />
										<Skeleton className="w-full h-[20px]" />
									</div>
								</div>
								<span className="mt-auto absolute bottom-0 backdrop-blur-lg">
									<strong className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] dark:from-white dark:to-white/40">
										Link your community.
									</strong>
									<p className="animate-fade-in mb-6 text-balance tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms]">
										Quickly enable a embed of your Discord server to show
										directly on your server page.
									</p>
								</span>
							</Material>
							<Material className="!p-0 z-0 relative border-0 rounded-none bg-transparent! hover:bg-white! hover:dark:bg-zinc-900! max-lg:h-[200px] transition-all">
								<span className="h-[calc(100%-100px)] flex justify-center items-center my-auto">
									<FlickeringGrid
										className="absolute inset-0 z-0 w-full h-full"
										squareSize={2}
										gridGap={4}
										color="#6B7280"
										maxOpacity={0.5}
										flickerChance={0.1}
									/>
									<Material className="relative z-0 w-[300px]">
										<span className="text-2xl">
											<FontChanger nounderline>
												<AuroraText>My Server</AuroraText>
											</FontChanger>
										</span>
										Lorem ipsum dolor sit amet consectetur adipiscing elit.
										Consectetur adipiscing elit quisque faucibus ex sapien
										vitae.
									</Material>
								</span>

								<span className="mt-auto absolute bottom-0 backdrop-blur-lg pl-4 pt-2">
									<strong className="animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text pb-6 font-semibold leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] dark:from-white dark:to-white/40">
										Whats your server?
									</strong>
									<p className="animate-fade-in mb-6 text-balance tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms]">
										Describe your server using Markdown to include bold, italic
										& images directly in the description of your server.
									</p>
								</span>
							</Material>
						</div>
						<div className="border-l lg:flex hidden w-[50px] h-[350px] text-shadcn-primary/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)] " />
					</section>

					<section className="flex w-full items-center justify-center py-16 text-center">
						<span>
							<h1>
								<FlipText className="text-balance bg-gradient-to-br pb-6 text-2xl font-semibold leading-none tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl text-black dark:text-white">
									The modern server list
								</FlipText>
							</h1>
							<p className="mb-6 text-balance tracking-tight text-gray-400">
								Whether you are a player, data hunter or server owner, MHSF{" "}
								<br />
								always has a solution to the community side of Minehut.
							</p>
							<Link href="/servers">
								<InteractiveHoverButton>Find servers</InteractiveHoverButton>
							</Link>
						</span>
					</section>
				</section>
			</span>

			<div className="hidden md:block relative sm:max-w-[1158px] mx-auto w-full -z-10 h-[300px] overflow-clip mt-[100px]">
				<div
					className={cn(
						"hidden md:block absolute left-1/2 z-10 -translate-x-1/2 translate-y-[125px]",
						"text-center text-[255px] font-bold leading-none before:bg-gradient-to-b before:from-gray-200 before:dark:from-gray-700",
						"before:to-gray-100/30 before:dark:to-gray-500/30 before:to-80% before:bg-clip-text before:text-transparent before:content-['MHSF']",
						"after:absolute after:inset-0 after:bg-gray-300/70 after:dark:bg-gray-700/70 after:bg-clip-text after:text-transparent after:mix-blend-darken",
						"after:content-['MHSF'] after:[text-shadow:0_1px_0_white] after:dark:[text-shadow:0_1px_0_black] dark:text-gray-700",
					)}
				/>
				<FlickeringGrid
					className="opacity-80 absolute z-5 translate-y-[8px]"
					color="#6B7280"
					style={{
						maskImage: "linear-gradient(to bottom, transparent, black)",
					}}
				/>
			</div>
		</div>
	);
}

function TypeScriptError({ name, code }: { name: string; code: string }) {
	return (
		<figure
			className={cn(
				"block break-words mx-auto max-w-full cursor-pointer rounded-2xl p-4",
				// animation styles
				"transition-all duration-200 ease-in-out hover:scale-[103%]",
				// light styles
				"bg-transparent [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
				// dark styles
				"transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
			)}
		>
			<div className="block gap-3">
				<div className="overflow-hidden">
					<p className="break-words block max-w-full text-lg font-medium dark:text-white ">
						<span className="text-sm sm:text-lg">{name}</span>
						<span className="mx-1">·</span>
						<span className="text-xs text-gray-500">ts({code})</span>
					</p>
				</div>
			</div>
		</figure>
	);
}
