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

import {
	Setting,
	SettingContent,
	SettingDescription,
	SettingMeta,
	SettingTitle,
} from "@/components/feat/settings/setting";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Material } from "@/components/ui/material";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import type { ServerResponse } from "@/lib/types/mh-server";
import { useState } from "react";
import { toast } from "sonner";

export function ServerUnownBox({
	mhsfData,
	serverData,
	reset,
}: {
	mhsfData: ReturnType<typeof useMHSFServer>;
	serverData: ServerResponse;
	reset: () => void;
}) {
	const [input, setInput] = useState("");

	return (
		<Material className="flex items-center p-2 mt-2">
			<Setting>
				<SettingContent>
					<SettingMeta>
						<SettingTitle>Unlink server</SettingTitle>
						<SettingDescription>This cannot be undone.</SettingDescription>
					</SettingMeta>
					<Drawer>
						<DrawerTrigger asChild>
							<Button variant="danger">Unlink</Button>
						</DrawerTrigger>
						<DrawerContent>
							<div className="mx-auto w-full max-w-sm">
								<DialogTitle>Are you sure?</DialogTitle>
								<p className="text-sm">
									Unlinking a server will remove all customizations of it and
									you will not be able to customize your server again until you
									link the server again.
								</p>
								<Input
									label="Server name"
									className="mt-2 w-full mb-2"
									placeholder="Type the name of the server"
									value={input}
									onChange={(e) => setInput(e.target.value)}
								/>

								<DialogTrigger>
									<Button
										variant="danger"
										className="w-full mb-4"
										disabled={
											input.toLocaleLowerCase() !==
											serverData.name.toLocaleLowerCase()
										}
										onClick={async () => {
											toast.promise(
												fetch(
													`/api/v1/server/get/${serverData._id}/settings/unlink-server`,
												)
													.then((c) => c.json())
													.then(() => setInput(""))
													.then(() => reset()),
												{
													loading: "Unlinking server",
													success: "Successfully unlinked server",
													error: "Failed to unlink server",
												},
											);
										}}
									>
										Unlink
									</Button>
								</DialogTrigger>
							</div>
						</DrawerContent>
					</Drawer>
				</SettingContent>
			</Setting>
		</Material>
	);
}
