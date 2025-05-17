import { Input } from "@/components/ui/input";
import { Material } from "@/components/ui/material";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import { ServerResponse } from "@/lib/types/mh-server";
import { debounce } from "lodash";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ServerColorModeBox({
	serverData,
	minehutData,
}: {
	serverData: ReturnType<typeof useMHSFServer>;
	minehutData: ServerResponse;
}) {
	const [colorModeEnabled, setColorModeEnabled] = useState(false);
	const [colorMode, setColorMode] = useState("light");

	useEffect(() => {
		setColorModeEnabled(
			serverData.server?.customizationData.colorMode !== null,
		);
		setColorMode(serverData.server?.customizationData.colorMode ?? "light");
	}, [serverData]);

	useEffect(() => {
		if (colorMode === "idc") {
			setColorModeEnabled(false);
			setColorMode("light");
		}
		if (colorModeEnabled) {
			if (colorMode === "dark") 
				window.dispatchEvent(new Event("force-dark-mode"));

			if (colorMode === "light")
				window.dispatchEvent(new Event("force-light-mode"));
		} else window.dispatchEvent(new Event("force-no-mode"));
	}, [colorMode, colorModeEnabled]);

	useEffect(() => {
		update();
	}, [colorMode, colorModeEnabled]);

	const update = debounce(async () => {
		await fetch(
			`/api/v1/server/get/${minehutData._id}/settings/change-color-mode${colorModeEnabled !== false ? `?colorMode=${colorMode}` : ""}`,
		);
	}, 500);

	return (
		<Material className="flex justify-between items-center p-2 mt-2">
			<div className="flex items-center font-bold gap-4">
				<Switch
					checked={colorModeEnabled}
					onCheckedChange={setColorModeEnabled}
				/>{" "}
				Enforce color mode
			</div>

			<Select
				disabled={!colorModeEnabled}
				onValueChange={setColorMode}
				value={colorMode}
			>
				<SelectTrigger className="w-[180px] disabled:hidden">
					<SelectValue placeholder="Select mode" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="dark">
							<div className="flex items-center gap-2">
								<Moon size={16} />
								Dark
							</div>
						</SelectItem>
						<SelectItem value="light">
							<div className="flex items-center gap-2">
								<Sun size={16} />
								Light
							</div>
						</SelectItem>
						<SelectItem value="idc">I couldn't care less</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</Material>
	);
}
