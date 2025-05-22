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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Material } from "@/components/ui/material";
import { useEffect, useState } from "react";
import ShikiHighlighter from "react-shiki";
import { toast } from "sonner";

export function ServerDiscordBox({
	mhsfServer,
	defaultDiscord,
}: { mhsfServer: string; defaultDiscord: string }) {
	const [serverId, setServerId] = useState(defaultDiscord);
	const [allowed, setAllowed] = useState(false);

	useEffect(() => {
		(async () => {
			setAllowed(false);
			if (
				serverId.length <= 25 &&
				serverId.length > 3 &&
				/^\d+$/.test(serverId as string)
			) {
				const { ok, body } = await fetch(
					`https://discord.com/api/guilds/${serverId}/widget.json`,
				);
				if (ok) setAllowed(true);
			}
		})();
	}, [serverId]);

	return (
		<Material className="grid gap-1 max-h-[700px] mt-2">
			<strong className="flex items-center gap-2">Discord Embed</strong>
			<div className="grid grid-cols-2">
				<div className="border-r p-4">
					<p className="my-2">
						Enable Discord widgets in your server settings (Settings -{">"}{" "}
						Engagement -{">"} Enable Server Widget) to use this. <br />
						Note: We'll handle all of the query variables on the URL for you
						(like theming and usernames).
					</p>
					<Input
						placeholder="Server ID"
						value={serverId}
						onChange={(e) => setServerId(e.target.value)}
						label="Enter your server ID shown in your engagement tab"
					/>
					<Button
						className="w-full my-2"
						disabled={!allowed}
						onClick={async () => {
							toast.promise(
								fetch(
									`/api/v1/server/get/${mhsfServer}/settings/change-discord?discordServerId=${serverId}`,
								),
								{
									success: "Discord widget enabled",
									error: "An error occurred",
									loading: "Enabling Discord widget",
								},
							);
						}}
					>
						Submit
					</Button>
				</div>

				<div className="p-4">
					{serverId !== "" && (
						<iframe
							src={`https://discord.com/widget?id=${serverId}&theme=dark`}
							width={350}
							height={300}
							// @ts-ignore bro idk what react is on :sob:
							allowtransparency={true}
							frameBorder={0}
							title="Discord Embed"
							sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
						/>
					)}
				</div>
			</div>
		</Material>
	);
}
