import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Material } from "@/components/ui/material";
import type { MHSFData } from "@/lib/types/data";
import type { OnlineServer, ServerResponse } from "@/lib/types/mh-server";
import type { RouteParams } from "@/pages/api/v1/server/get/[server]";
import { useEffect, useState } from "react";
import {
	Setting,
	SettingContent,
	SettingDescription,
	SettingMeta,
	SettingTitle,
} from "../../settings/setting";
import { Spinner } from "@/components/ui/spinner";
import { codeToHtml } from "shiki";
import { useTheme } from "@/lib/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import useClipboard from "@/lib/useClipboard";
import { DebugShikiParsedDrawer } from "./debug-shiki-parsed";
import { convert } from "../util";
import { Switch } from "@/components/ui/switch";

export function DebugMenu({
	debugOptions,
	setOpen,
	open,
}: {
	debugOptions: {
		serverName: string;
		serverId: string;
		mhsfData: (MHSFData & RouteParams) | null;
		serverData: ServerResponse | null;
		onlineServerData: OnlineServer | null;
	};
	open: boolean;
	setOpen: (newState: boolean) => void;
}) {
	const [mhsfShikiParsed, setMHSFShikiParsed] = useState("");
	const [mhShikiParsed, setMHShikiParsed] = useState("");
	const clipboard = useClipboard();
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		(async () => {
			setMHSFShikiParsed(
				await codeToHtml(JSON.stringify(debugOptions.mhsfData, null, 2), {
					lang: "json",
					theme: resolvedTheme === "dark" ? "vitesse-dark" : "vitesse-light",
				}),
			);
			setMHShikiParsed(
				await codeToHtml(JSON.stringify(debugOptions.serverData, null, 2), {
					lang: "json",
					theme: resolvedTheme === "dark" ? "vitesse-dark" : "vitesse-light",
				}),
			);
		})();
	}, [debugOptions]);

	return (
		<Drawer onOpenChange={setOpen} open={open} direction="right">
			<DrawerContent className="p-4 min-w-[600px] overflow-x-hidden max-h-screen overflow-y-auto">
				<DrawerTitle className="text-lg mb-3 flex items-center gap-2">
					<Wrench size={24} /> Debug Options
				</DrawerTitle>
				<span className="m-2 mt-1 text-sm">
					This data is only designed for developers; it contains every single
					piece of information MHSF knows about the server. Could be useful for
					adding new backend options or endpoints.{" "}
					<strong>
						This only shows up when Debug Mode is enabled. (or when using
						Ctrl+Shift+O)
					</strong>
				</span>
				<Material className="mb-2">
					<Setting>
						<SettingContent>
							<SettingMeta>
								<SettingTitle>Server name</SettingTitle>
								<SettingDescription>
									Name of server after being parsed through Minehut API (aka
									server.name)
								</SettingDescription>
							</SettingMeta>
							{debugOptions.serverName}
						</SettingContent>
					</Setting>
				</Material>
				<Material className="mb-2">
					<Setting>
						<SettingContent>
							<SettingMeta>
								<SettingTitle>Server Id</SettingTitle>
								<SettingDescription>
									Passed usually through query
								</SettingDescription>
							</SettingMeta>
							{debugOptions.serverId}
						</SettingContent>
					</Setting>
				</Material>
				<Material className="mb-2">
					<strong className="flex items-center gap-2">
						{debugOptions.serverData === null && <Spinner />} Parsed Minehut
						data
						<Button
							size="sm"
							onClick={() =>
								clipboard.writeText(JSON.stringify(debugOptions.serverData))
							}
						>
							Copy (no toast!)
						</Button>
					</strong>
					<span
						dangerouslySetInnerHTML={{ __html: mhShikiParsed }}
						className="break-all max-w-[100px]"
					/>
				</Material>
				<Material className="mb-2">
					<strong className="flex items-center gap-2">
						{debugOptions.mhsfData === null && <Spinner />} Parsed MHSF data
						<Button
							size="sm"
							onClick={() =>
								clipboard.writeText(JSON.stringify(debugOptions.mhsfData))
							}
						>
							Copy (no toast!)
						</Button>
					</strong>
					{debugOptions.mhsfData !== null && (
						<>
							<Setting className="py-3">
								<SettingContent>
									<SettingMeta>
										<SettingTitle>See all data</SettingTitle>
										<SettingDescription>
											WARNING: this data is MASSIVE. (@keyboard yk what else is
											massive?)
										</SettingDescription>
									</SettingMeta>
									<DebugShikiParsedDrawer shikiParsed={mhsfShikiParsed}>
										<Button>Open data</Button>
									</DebugShikiParsedDrawer>
								</SettingContent>
							</Setting>
							<Setting className="py-3">
                {debugOptions.mhsfData !== undefined && <SettingContent>
									<SettingMeta>
										<SettingTitle>Total Statistical Data Count</SettingTitle>
										<SettingDescription>
											How many times has MHSF grabbed data about this server?
										</SettingDescription>
									</SettingMeta>
									{convert(
										(
											debugOptions.mhsfData.achievements ?? {
												historically: { length: 0 },
											}
										).historically.length +
											(
												debugOptions.mhsfData.playerData ?? {
													historically: { length: 0 },
												}
											).historically.length +
											(
												debugOptions.mhsfData.favoriteData ?? {
													favoriteHistoricalData: { length: 0 },
												}
											).favoriteHistoricalData.length,
									)}
								</SettingContent>}
								
							</Setting>

							<Setting className="py-3">
								<SettingContent>
									<SettingMeta>
										<SettingTitle>
											Disable image caching on customization images
										</SettingTitle>
										<SettingDescription>
											Enabling this could result in being tracked but{" "}
											<strong>very rarely</strong> could render the image
											faster. (removes wsrv.nl caching)
										</SettingDescription>
									</SettingMeta>
									<Switch />
								</SettingContent>
							</Setting>
						</>
					)}
				</Material>
			</DrawerContent>
		</Drawer>
	);
}
