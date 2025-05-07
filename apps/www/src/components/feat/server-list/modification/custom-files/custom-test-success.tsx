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

import { toast } from "sonner";
import type { ClerkCustomActivatedModification } from "../modification-file-creation-dialog";
import { useUser } from "@clerk/nextjs";
import { Alert } from "@/components/ui/alert";
import { Material } from "@/components/ui/material";
import {
	Setting,
	SettingContent,
	SettingDescription,
	SettingMeta,
	SettingTitle,
} from "@/components/feat/settings/setting";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { transpileTypeScript } from "@/app/(sl-modification-frame)/servers/embedded/sl-modification-frame/file/[filename]/page";
import { useRouter } from "@/lib/useRouter";

export function CustomTestSuccess({
	filename,
	testMode,
	value,
}: { filename: string; testMode: "filter" | "sort" | ""; value: string }) {
	const { user } = useUser();
	const [friendlyName, setFriendlyName] = useState("");
	const router = useRouter();

	return (
		<>
			<p className="text-sm my-2">
				You can now activate this custom modification. Please note that the
				filter and sort versions of your modifications will be different, and
				the one used will be selected based on what type you tested on.
			</p>
			{(
				(user?.unsafeMetadata
					.activatedModifications as ClerkCustomActivatedModification[]) ?? []
			).find(
				(c) => c.originalFileName === filename && c.testMode === testMode,
			) !== undefined && (
				<Alert className="mb-2 gap-2" variant="warning">
					This modification was already activated! Hitting activate here will
					just overwrite the contents and the new friendly name.
				</Alert>
			)}

			<Material>
				<Setting>
					<SettingContent>
						<SettingMeta>
							<SettingTitle>Name</SettingTitle>
							<SettingDescription>
								Set a friendly name for your modification.
							</SettingDescription>
						</SettingMeta>
						<Input
							placeholder="My cool mod"
							value={friendlyName}
							onChange={(c) => setFriendlyName(c.target.value)}
						/>
					</SettingContent>
				</Setting>
			</Material>
			<DialogTrigger>
				<Button
					className="w-full my-2"
					disabled={friendlyName === "" || friendlyName.replace(" ", "") === ""}
					onClick={async () => {
						const array =
							(user?.unsafeMetadata
								.activatedModifications as ClerkCustomActivatedModification[]) ??
							[];
						const index = array.findIndex(
							(c) => c.originalFileName === filename && c.testMode === testMode,
						);
						const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
						const transpiledValue = transpileTypeScript(value);

						if (transpiledValue === null)
							return toast.error("Error transpiling");

						if (index !== -1) {
							// Original already exists
							array[index] = {
								originalFileName: filename,
								friendlyName,
								transpiledContents: transpiledValue,
								active: true,
								testMode: testMode as "filter" | "sort",
								color,
							};
						} else {
							array.push({
								originalFileName: filename,
								friendlyName,
								transpiledContents: transpiledValue,
								active: true,
								testMode: testMode as "filter" | "sort",
								color,
							});
						}

						await user?.update({
							unsafeMetadata: {
								...(user.unsafeMetadata ?? {}),
								activatedModifications: array,
							},
						});

						toast.success("Activated!");
						router.push("/servers/embedded/sl-modification-frame");
					}}
				>
					Activate
				</Button>
			</DialogTrigger>
		</>
	);
}
