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
import { ServerResponse } from "@/lib/types/mh-server";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import {
	EllipsisVertical,
	Flag,
	Heart,
	Pencil,
	Share,
	Star,
} from "lucide-react";
import { useFavoriteStore } from "@/lib/hooks/use-favorite-store";
import { useState } from "react";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import NumberFlow from "@number-flow/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useClipboard from "@/lib/useClipboard";
import { toast } from "sonner";

export function ServerPageButtons({
	server,
	mhsfData,
}: {
	server: ServerResponse;
	mhsfData: ReturnType<typeof useMHSFServer>;
}) {
	const clerk = useClerk();
	const clipboard = useClipboard();
	const favoritesStore = useFavoriteStore(mhsfData);
	const [loading, setLoading] = useState(false);

	return (
		<span className="flex items-center gap-2">
			<SignedIn>
				<Button
					className="flex items-center gap-2 text-sm"
					variant={favoritesStore.isFavorite ? "secondary" : "default"}
					onClick={async () => {
						setLoading(true);
						await favoritesStore.toggleFavorite();
						setLoading(false);
					}}
					disabled={loading || favoritesStore.isFavorite === null}
				>
					<Heart
						size={16}
						fill={favoritesStore.isFavorite ? "red" : "transparent"}
						color="red"
					/>
					Favorite
					{favoritesStore.favoriteNumber !== null && (
						<code>
							<NumberFlow value={favoritesStore.favoriteNumber} />{" "}
						</code>
					)}
				</Button>
			</SignedIn>
			<SignedOut>
				<Button
					className="flex items-center gap-2 text-sm"
					onClick={() => clerk.openSignUp()}
				>
					<Star size={16} />
					Favorite
					{favoritesStore.favoriteNumber !== null && (
						<code>{favoritesStore.favoriteNumber}</code>
					)}
				</Button>
			</SignedOut>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button
						className="flex items-center"
						size="square-md"
						variant="secondary"
					>
						<EllipsisVertical size={16} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSeparator>Server</DropdownMenuSeparator>
					<DropdownMenuItem
						className="flex items-center gap-2"
						onClick={() =>
							window.dispatchEvent(new Event("open-server-editor"))
						}
					>
						<Pencil size={16} />
						Edit Server
					</DropdownMenuItem>
					<DropdownMenuItem
						className="flex items-center gap-2"
						onClick={() => {
							const data = {
								url: `https://mhsf.app/server/v2/minehut/${server._id}`,
								text: "Check out MHSF, the modern server finder!",
							};
							if (navigator.canShare(data)) navigator.share(data);
							else {
								clipboard.writeText(data.url);
								toast.success("Sent to clipboard!");
							}
						}}
					>
						<Share size={16} />
						Share
					</DropdownMenuItem>
					<DropdownMenuSeparator>Destructive</DropdownMenuSeparator>
					<DropdownMenuItem
						className="text-red-400 flex items-center gap-2"
						onClick={() => {
							window.dispatchEvent(new Event("open-report-menu"));
						}}
					>
						<Flag size={16} />
						Report
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</span>
	);
}
