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
import { Material } from "@/components/ui/material";
import { Spinner } from "@/components/ui/spinner";
import { useEffectOnce } from "@/lib/useEffectOnce";
import { useRouter } from "@/lib/useRouter";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { WaitlistSuccessDialog } from "./waitlist-success";

export function WaitlistReferralBeta() {
	const [id] = useQueryState("id", { defaultValue: "" });
    const clerk = useClerk();

	return (
		<div className="px-3 lg:px-32 pt-24">
			<h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl mb-3">
				v2 private beta
			</h1>
			<p className="mb-3">
				Hello there! MHSF has an exclusive beta that you may have been invited{" "}
				<br /> to. Please sign into your account below or follow the
				instructions.
			</p>

			<Material>
				<SignedIn>
					<LoggedInBoundary id={id} />
				</SignedIn>
				<SignedOut>
					<div className="flex items-center gap-2">
						<Button variant="secondary" onClick={() => clerk.openSignIn()}>Sign In</Button>
						<Button onClick={() => clerk.openSignUp()}>Sign Up</Button>
					</div>
				</SignedOut>
			</Material>
		</div>
	);
}

function LoggedInBoundary({ id }: { id: string }) {
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState(false);
	const [text, setText] = useState("");
	const router = useRouter();

	useEffectOnce(() => {
		(async () => {
			const refEligibility = await fetch(
				"/api/v1/user/waitlist/ref-waitlist-eligibility",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id }),
				},
			);
			const status = refEligibility.status;
			const json = await refEligibility.json();

			if (status === 200) {
				setSuccess(true);
			} else {
				setText(json.message);
			}
            setLoading(false);
		})();
	});

	if (loading) return <Spinner />;

	return <div>{!success && <>{text}</>} <WaitlistSuccessDialog open={success} setOpen={() => true} /></div>;
}
