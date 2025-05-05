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

import { Material } from "@/components/ui/material";
import {
	SignedIn,
	SignedOut,
	useReverification,
	useSignIn,
	useUser,
} from "@clerk/nextjs";
import type { CreateExternalAccountParams, OAuthStrategy } from "@clerk/types";
import { UserInformation } from "./waitlist-page";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/useRouter";

export function WaitlistDiscordNeeded() {
	return (
		<div className="px-3 lg:px-32 pt-24">
			<h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-3">
				Discord link required
			</h1>
			<p className="mb-3">
				You are using an MHSF account that hasn't been linked w/ Discord. We{" "}
				<br />
				need to ensure you are in the beta, and need you to link your Discord to{" "}
				<br />
				verify your identity.
			</p>

			<SignedIn>
				<Material className="mb-2">
					<UserInformation discordPage />
				</Material>
			</SignedIn>

			<Material>
				<SignedOut>You're signed out.</SignedOut>
				<SignedIn>
					<SignedInBoundary />
				</SignedIn>
			</Material>
		</div>
	);
}

function SignedInBoundary() {
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const { isLoaded, user } = useUser();
	const createExternalAccount = useReverification(
		(params: CreateExternalAccountParams) =>
			user?.createExternalAccount(params),
	);

	useEffectOnce(() => {
		(async () => {
			const user = await fetch("/api/v1/user/waitlist/get-discord-details");

			if (user.status !== 200) setLoading(false);
		})();
	});

	if (loading) return <Spinner />;

	const addDiscord = async () => {
		await createExternalAccount({
			strategy: "oauth_discord",
			redirectUrl: "/waitlist",
		})
			.then((res) => {
				if (res?.verification?.externalVerificationRedirectURL) {
					router.push(res.verification.externalVerificationRedirectURL.href);
				}
			})
			.catch((err) => {
				console.log("ERROR", err);
			});
	};

	return (
		<>
			<Button onClick={() => addDiscord()}>Link your Discord account</Button>
		</>
	);
}
