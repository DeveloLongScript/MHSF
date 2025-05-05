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

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { OnlineServer } from "@/lib/types/mh-server";
import { type ReactNode, useEffect, useState } from "react";
import { MOTDRenderer } from "../server-page/motd/motd-renderer";
import IconDisplay from "../icons/minecraft-icon-display";
import ServerCard, { TagShower } from "./server-card";

export function ServerRandomServerProvider({
	servers,
	children,
}: { servers: OnlineServer[]; children: ReactNode | ReactNode[] }) {
	const [open, setOpen] = useState(false);
	const [selectedServer, setSelectedServer] = useState<OnlineServer | null>();

	useEffect(() => {
		if (servers.length !== 0)
			window.addEventListener("open-random-server", () => {
				setSelectedServer(servers[Math.floor(Math.random() * servers.length)]);
				setOpen(true);
			});
	}, [servers]);

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					{selectedServer !== null && selectedServer !== undefined && (
						<ServerCard server={selectedServer}/>
					)}
				</DialogContent>
			</Dialog>
			{children}
		</>
	);
}
