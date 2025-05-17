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
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import type { ServerResponse } from "@/lib/types/mh-server";
import { ServerEditorDescription } from "../server-editor-description";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { debounce } from "lodash";

export function ServerDescriptionBox({
	serverData,
	minehutData,
}: {
	serverData: ReturnType<typeof useMHSFServer>;
	minehutData: ServerResponse;
}) {
	const [descriptionSaved, setDescriptionSaved] = useState(true);

	const save = debounce(async (content) => {
		await fetch(`/api/v1/server/get/${minehutData._id}/settings/change-description?description=${encodeURIComponent(btoa(content))}`);
		setDescriptionSaved(true);
	}, 250);
	const reload = debounce(async () => {
		await serverData.refresh()
	}, 1000)
	return (
		<Material className="grid gap-1 max-h-[700px]">
			<strong className="flex items-center gap-2">Server Description <Badge className="ml-2">{descriptionSaved ? "Saved" : "Not Saved"}</Badge></strong>
			<p className="mb-3">
				A markdown enabled, fancy description for your server! Describe what
				players will expect from your server and why they should join; don't
				worry, you have more space than MOTD's.
			</p>
			{!serverData.loading && (
				<ServerEditorDescription
					defaultMarkdown={
						serverData.server?.customizationData.description ??
						`# ${minehutData.name}`
					}
					onUpdate={async (content) => {
						setDescriptionSaved(false);
						save(content);
						reload();
					}}
				/>
			)}
		</Material>
	);
}
