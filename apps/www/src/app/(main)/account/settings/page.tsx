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
import { useClerk, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { unlinkMCAccount } from "@/lib/api";
import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CodeDialog from "@/components/misc/LinkDialog";

export default function Settings() {
	const clerk = useClerk();

	const { user, isSignedIn } = useUser();
	const [linked, setLinked] = useState(false);
	useEffect(() => {
		setLinked(user?.publicMetadata.player != undefined);
	}, [user, isSignedIn]);

	const forceUnlink = async () => {
    if (!linked) await toast.promise(unlinkMCAccount(), {
      success: "Unlinked account!",
      loading: "Unlinking...",
      error: "Error while unlinking account.",
    });
    else
      await toast.warning("Please use the normal unlink option before using the force unlink one.")
  };

	return (
		<main className="p-4">
			<strong className="text-3xl">Linking</strong>
			<br />
			<br />
			<strong className="font-bold">Link Account</strong>
			<div className="flex items-center">
				<p>
					Link a Minecraft account to customize a server you own.
					<br />{" "}
					{user?.publicMetadata.player != undefined && linked && (
						<>Currently linked to {user?.publicMetadata.player as string}</>
					)}
				</p>

				<Dialog>
					<DialogTrigger>
						{!linked && <Button className="h-[30px] ml-2">Link Account</Button>}
					</DialogTrigger>
					<DialogContent>
						<CodeDialog
							linked={linked}
							setLinked={(c) => {
								setLinked(c);
							}}
						/>
					</DialogContent>
				</Dialog>

				{linked && (
					<Button className="h-[30px] ml-2" disabled>
						Already linked
					</Button>
				)}
			</div>
			<br />
			<strong className="font-bold">Unlink Account</strong>
			<div className="flex items-center">
				<p>Unlink your Minecraft account if you have already linked one.</p>

				{!linked && (
					<Button className="h-[30px] ml-2" disabled>
						No linked account
					</Button>
				)}

				{linked && (
					<Button
						className="h-[30px] ml-2"
						variant="destructive"
						onClick={async () => {
							await toast.promise(unlinkMCAccount(), {
								success: "Unlinked account!",
								loading: "Unlinking...",
								error: "Error while unlinking account.",
							});
							setLinked(false);
						}}
					>
						Unlink account
					</Button>
				)}
			</div>
			<small className="mt-0">
				All of your customizations stay the same, and can be changed if another
				account links your Minecraft account.{" "}
				<div
					className="cursor-pointer text-blue-600"
					onClick={forceUnlink}
					onKeyDown={forceUnlink}
					onKeyUp={forceUnlink}
				>
					Still linked in-game? Force unlink your account.
				</div>
			</small>
		</main>
	);
}
