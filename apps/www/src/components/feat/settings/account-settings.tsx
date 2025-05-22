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

import { Material } from "@/components/ui/material";
import {
	Setting,
	SettingContent,
	SettingDescription,
	SettingMeta,
	SettingTitle,
} from "./setting";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { LinkingDialog } from "./linking-dialog";
import { useUser } from "@/lib/hooks/use-user";
import { toast } from "sonner";
import { useMinecraftHead } from "@/lib/hooks/use-minecraft-head";
import Image from "next/image";
import { Placeholder } from "@/components/ui/placeholder";
import { EllipsisVertical, Star, StarOff } from "lucide-react";
import { useRouter } from "@/lib/useRouter";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServerResponse } from "@/lib/types/mh-server";
import { useEffect, useState } from "react";
import { useEffectOnce } from "@/lib/useEffectOnce";

export function AccountSettings() {
	const { user, refresh } = useUser();
	const router = useRouter();

	if (user !== null)
		return (
			<Material className="mt-6 grid gap-4">
				<h2 className="text-xl font-semibold text-inherit">Link Account</h2>
				<Setting>
					<SettingContent>
						<SettingMeta>
							<SettingTitle>Link Account</SettingTitle>
							<SettingDescription>
								Link a Minecraft account to confirm you own a server and
								customize it with certain information to make it look better to
								other MHSF users.
							</SettingDescription>
						</SettingMeta>
						<LinkingDialog refresh={refresh}>
							<Button disabled={user?.claimedUser !== null}>
								{user?.claimedUser === null
									? "Link Account"
									: "(account already linked)"}
							</Button>
						</LinkingDialog>
					</SettingContent>
				</Setting>
				<Setting>
					<SettingContent>
						<SettingMeta>
							<SettingTitle>Unlink Account</SettingTitle>
						</SettingMeta>
						<Button
							variant="danger"
							disabled={user?.claimedUser === null}
							onClick={() => {
								toast.promise(
									fetch(user?.actions.unlinkAccount as string).then(() =>
										refresh(),
									),
									{
										loading: "Unlinking...",
										success: "Unlinked!",
										error: "Failed to unlink",
									},
								);
							}}
						>
							Unlink
						</Button>
					</SettingContent>
				</Setting>
				{user.claimedUser !== null && (
					<Setting>
						<SettingContent>
							<SettingMeta>
								<SettingTitle>Account Name</SettingTitle>
							</SettingMeta>
							<div className="flex items-center gap-2">
								<Image
									src={`https://api.mineatar.io/face/${user.claimedUser?.uuid}`}
									alt=""
									className="rounded"
									width={16}
									height={16}
								/>
								{user.claimedUser?.name}
							</div>
						</SettingContent>
					</Setting>
				)}
				<h2 className="text-xl font-semibold text-inherit">Favorite Servers</h2>
				{user.favorites !== null && user.favorites.favorites.length > 0 ? (
					<div>
						{user.favorites.favorites.map((server, i) => (
							<Setting key={i}>
								<SettingContent>
									<SettingMeta>
										<SettingTitle>{server}</SettingTitle>
									</SettingMeta>
									<div className="flex items-center gap-2">
										<Button onClick={() => router.push(`/server/${server}`)}>
											Open Server
										</Button>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													className="flex items-center"
													size="square-md"
													variant="secondary"
												>
													<EllipsisVertical size={16} />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem
													className="flex items-center gap-2"
													onClick={async () => {
														const minehut: { server: ServerResponse } =
															await fetch(
																`https://api.minehut.com/server/${server}?byName=true`,
															).then((c) => c.json());
														toast.promise(
															fetch(
																`/api/v1/server/get/${minehut.server._id}/favorite-server`,
															).then(() => refresh()),
															{
																loading: "Removing favorite...",
																success: "Removed favorite!",
																error: "Failed to unfavorite",
															},
														);
													}}
												>
													<Star size={16} />
													Unfavorite
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</SettingContent>
							</Setting>
						))}
					</div>
				) : (
					<Placeholder
						title="You have no favorite servers"
						icon={<StarOff />}
					/>
				)}
				<h2 className="text-xl font-semibold text-inherit">Owned Servers</h2>

				{user.ownedServers !== null && user.ownedServers.length > 0 ? (
					<div>{user.ownedServers.map((server, i) => <OwnedServer server={server} key={i} />)}</div>
				) : (
					<Placeholder
						title="You have no favorite servers"
						icon={<StarOff />}
					/>
				)}
			</Material>
		);

	return <Spinner />;
}

const OwnedServer = ({server}: {server: any}) => {
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState("");
	const [joins, setJoins] = useState(0);
	const router = useRouter();

	useEffectOnce(() => {
		fetch(`https://api.minehut.com/server/${server.serverId}`)
			.then((c) => c.json())
			.then((d: {server: ServerResponse}) => {
				setLoading(false);
				setName(d.server.name);
				setJoins(d.server.joins);
			});
	});

	if (loading) return null;

	return (
		<Setting>
			<SettingContent>
				<SettingMeta>
					<SettingTitle>{name}</SettingTitle>
					<SettingDescription>{joins} joins</SettingDescription>
				</SettingMeta>
				<Button onClick={() => router.push(`/server/v2/minehut/${server.serverId}`)}>Open Server</Button>
			</SettingContent>
		</Setting>
	);
};
