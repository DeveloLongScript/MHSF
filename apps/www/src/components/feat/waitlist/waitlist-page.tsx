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

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Material } from "@/components/ui/material";
import { Spinner } from "@/components/ui/spinner";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { useRouter } from "@/lib/useRouter";
import type { DiscordUser } from "@/pages/api/v1/user/waitlist/check-waitlist-eligibility";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { CalendarArrowDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { WaitlistSuccessDialog } from "./waitlist-success";

export function WaitlistPage() {
	const clerk = useClerk();
	const { user } = useUser();

	return (
		<div className="px-3 lg:px-32 pt-24">
			<h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-3">
				v2 private beta
			</h1>
			<p className="mb-3 text-sm">
				Hello there! MHSF has an exclusive beta that you may have been invited{" "}
				<br /> to. Please sign into your account below or follow the
				instructions.
			</p>
			<SignedIn>
				<Material className="mb-2">
					<UserInformation />
				</Material>
			</SignedIn>
			<Material>
				<SignedOut>
					<p>
						You must be signed in to check for eligibility for this beta. Please
						make sure you use the Discord connection so we can check if you are
						eligible for the beta.
					</p>
					<span className="flex items-center gap-2">
						<Button onClick={() => clerk.openSignIn()} variant="secondary">
							Sign-in
						</Button>
						<Button onClick={() => clerk.openSignUp()}>Sign-up</Button>
					</span>
				</SignedOut>
				<SignedIn>
					{user?.publicMetadata.v2allowed !== true ? (
						<SignedInBoundary />
					) : (
						<Alert variant="normal" className="gap-2">
							You are already in the v2 beta.
						</Alert>
					)}
				</SignedIn>
			</Material>
		</div>
	);
}

export function UserInformation({ discordPage }: { discordPage?: boolean }) {
	const [loading, setLoading] = useState(true);
	const [discordData, setDiscordData] = useState<DiscordUser | null>(null);
	const router = useRouter();
	const { user } = useUser();

	useEffectOnce(() => {
		(async () => {
			const user = await fetch("/api/v1/user/waitlist/get-discord-details");
			const json = await user.json();

			if (user.status !== 200 && !discordPage) {
				router.push("/waitlist/oauth-need-discord");
			} else {
				setDiscordData(json.discordData as DiscordUser);
				setLoading(false);
			}
		})();
	});

	if (loading) return <Spinner />;

	return (
		<span className="flex items-center gap-2 text-sm">
			<Image
				alt="Clerk Image"
				src={
					user?.imageUrl === undefined
						? "https://img.clerk.com/preview.png?size=144&seed=seed&initials=AD&isSquare=true&bgType=marble&bgColor=6c47ff&fgType=silhouette&fgColor=FFFFFF&type=user&w=48&q=75"
						: user?.imageUrl
				}
				width={16}
				height={16}
				className="rounded-full"
			/>
			<span className="block">
				<p>Signed in as @{user?.username}</p>

				{discordData !== undefined && discordData !== null && (
					<p className="group cursor-pointer flex items-center gap-1">
						Discord linked as {discordData.global_name ?? discordData.username}
						<span className="text-muted-foreground hidden group-hover:block">
							@{discordData.username}
						</span>
						{discordData.clan.identity_enabled === true && (
							<Badge className="flex items-center">
								<Image
									src={`https://cdn.discordapp.com/clan-badges/${discordData.clan.identity_guild_id}/${discordData.clan.badge}.png?size=16`}
									alt="clan tag bg"
									width={16}
									height={16}
								/>
								{discordData.clan.tag}
							</Badge>
						)}
					</p>
				)}
			</span>
		</span>
	);
}

function SignedInBoundary() {
	const [loading, setLoading] = useState(true);
	const [text, setText] = useState("");
    const [id, setId] = useState("");
	const router = useRouter();
	const [success, setSuccess] = useState(false);

	useEffectOnce(() => {
		(async () => {
			const eligible = await fetch(
				"/api/v1/user/waitlist/check-waitlist-eligibility",
			);
			const json = await eligible.json();
			const status = eligible.status;

			setText(json.message);

			if (status === 200) {
                setId(json.refUUID);
				setSuccess(true);
			}

			setLoading(false);
		})();
	});

	if (loading) return <Spinner />;

	return (
		<p>
			{text} <WaitlistSuccessDialog open={success} setOpen={() => true} uuid={id} />
		</p>
	);
}
