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
import Link from "next/link";
import { ChevronLeft, ServerOff } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/lib/utils";
import { FormSpinner } from "@/components/ui/form-spinner";

export function LinkingDialog({ children, refresh }: { children: ReactNode, refresh: () => Promise<void> }) {
	const [step, setStep] = useState(0);
	const { user } = useUser();
	const [error, setError] = useState(false);
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [username, setUserName] = useState("");

	const onSubmit = async (code: string) => {
		setLoading(true);
		const fetchRes = await fetch(
			`/api/v1/user/claim-account-code?code=${code}`,
		);
		const json = await fetchRes.json();

		if (!fetchRes.ok) {
			setError(true);
			setLoading(false);
			return;
		}
		setUserName(json.player);
		setStep(2);
		setLoading(false);
		refresh();
	};

	return (
		<Dialog
			onOpenChange={(c) => {
				if (c) setStep(0);
				if (c) setLoading(false);
				if (c) setError(false);
				if (c) setCode("");
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="absolute h-[427px]">
				<div className="relative overflow-hidden min-h-full">
					<div
						className={`transition-transform duration-300 ease-in-out ${step === 0 ? "translate-x-0" : "-translate-x-full"}`}
					>
						<div className="flex flex-col h-[427px]">
							<div className="flex-grow">
								<DialogTitle className="font-bold text-2xl">
									Linking your account
								</DialogTitle>
								<p className="my-1 text-sm">
									In order to link your account, you must have a Minecraft: Java
									Edition account and be logged into your MHSF account.{" "}
									<strong>
										Linking MHSF does NOT involve Microsoft authentication.
									</strong>
								</p>
								<p className="my-1 mb-4 text-sm">
									<Link href="/server/CoreBoxx" className="underline">
										CoreBoxx
									</Link>{" "}
									has partnered with us to have an integrated account linking
									feature, which is also open all day.
								</p>
								<p className="py-1">
									<code className="border rounded-full bg-muted h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center">
										1
									</code>
									<span className="ml-[2.25rem] pt-0.5 grid grid-rows-2">
										<span>Join CoreBoxx</span>

										<code className="border rounded p-2">
											CoreBoxx.minehut.gg
										</code>
									</span>
								</p>
								<p className="py-1">
									<code className="border rounded-full bg-muted h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center">
										2
									</code>
									<span className="ml-[2.25rem] pt-0.5 grid">
										<span>
											Link your account using <code>/mhsf</code>
										</span>
									</span>
								</p>
								<p className="py-1">
									<code className="border rounded-full bg-muted h-[1.75rem] w-[1.75rem] absolute inline-flex items-center justify-center">
										3
									</code>
									<span className="ml-[2.25rem] pt-0.5 grid">
										<span>Input the code returned</span>
									</span>
								</p>
							</div>
							<Button
								className="w-full flex items-center mb-12"
								onClick={() => setStep(1)}
							>
								Continue
							</Button>
						</div>
					</div>
					<div
						className={`absolute h-full top-0 left-0 w-full transition-transform duration-300 ease-in-out ${step === 1 ? "translate-x-0" : "translate-x-full"}`}
					>
						<span className="flex p-4 items-center gap-2 text-sm w-full justify-center">
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
							<p>Signed in as @{user?.username}</p>
						</span>
						<strong className="text-center w-full flex items-center justify-center">
							Enter the code provided on the server:
						</strong>
						<div className="p-4 w-full flex items-center justify-center">
							<div>
								<InputOTP
									maxLength={6}
									pattern={REGEXP_ONLY_DIGITS}
									onComplete={onSubmit}
									value={code}
									onChange={(c) => {
										setCode(c);
										setError(false);
									}}
								>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
							</div>
						</div>
						{error && (
							<span className="text-red-400 text-sm">
								We couldn't find that code being used. Please try again later or
								double check the code provided to you.
							</span>
						)}
						<div
							className={cn(
								"flex items-center gap-1 w-full",
								error ? "pt-auto h-[calc(100%-3rem)]" : "mt-6.5 pt-auto h-full",
							)}
						>
							<Button
								className="h-[34px]"
								onClick={() => setStep(0)}
								disabled={loading}
							>
								<ChevronLeft size={16} />
							</Button>
							<Button
								className="w-full"
								onClick={() => onSubmit(code)}
								disabled={loading}
							>
								{loading ? <FormSpinner /> : "Continue"}
							</Button>
						</div>
					</div>

					<div
						className={`absolute h-full top-0 left-0 w-full transition-transform duration-300 ease-in-out ${step === 2 ? "translate-x-0" : "translate-x-full"}`}
					>
						<div className="flex flex-col h-[427px]">
							<div className="flex-grow">
								<DialogTitle className="font-bold text-2xl">
									You've linked your account!
								</DialogTitle>
								<p className="my-1 text-sm">
									Congratulations! You've successfully linked your account to{" "}
									{username}!
								</p>
							</div>
							<DialogTrigger asChild>
								<Button
									className="w-full flex items-center mb-12"
									onClick={() => setStep(1)}
								>
									Continue
								</Button>
							</DialogTrigger>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
