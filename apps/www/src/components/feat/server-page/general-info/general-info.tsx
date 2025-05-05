import { Material } from "@/components/ui/material";
import { Separator } from "@/components/ui/separator";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import type { ServerResponse } from "@/lib/types/mh-server";
import type { ReactNode } from "react";
import { convert } from "../util";
import IconDisplay from "../../icons/minecraft-icon-display";

export function GeneralInfo({
	server,
	mhsfData,
}: { server: ServerResponse; mhsfData: ReturnType<typeof useMHSFServer> }) {
	return (
		<Material className="p-4 relative h-[250px] max-lg:mt-3">
			<span className="mb-2">
				<strong className="text-lg">Information</strong>

				<Separator className="my-2" />
			</span>
			<div className="p-2 max-h-[170px] overflow-auto">
				<InfoBox
					title="Credits/Month"
					description={Math.floor(server.credits_per_day)}
				/>
				<InfoBox
					title="All time joins"
					description={convert(server.joins)}
				/>
				<InfoBox
					title="Server Id"
					description={<code>{server._id}</code>}
				/>
				<InfoBox
					title="Server Expired"
					description={server.expired ? "Yes" : "No"}
				/>
				<InfoBox
					title="Server External"
					description={server?.rawPlan === undefined
                        ? "? (unknown)"
                        : server?.rawPlan === "EXTERNAL" ? "Yes" : "No"}
				/>
				<InfoBox
					title="Server Icon"
					description={<div className="flex gap-1 items-center"><IconDisplay server={server}/><code>{(server.icon ?? "sign").toLocaleUpperCase()}</code></div>}
				/>
				<InfoBox
					title="Visible"
					description={server.visibility ? "Yes" : "No"}
				/>
			</div>
		</Material>
	);
}

function InfoBox({
	title,
	description,
}: { title: ReactNode; description: ReactNode }) {
	return (
		<span>
			<strong className="text-sm">{title}</strong>
			<p className="mb-1">{description}</p>
			<Separator />
		</span>
	);
}
