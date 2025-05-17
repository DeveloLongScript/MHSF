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

import { Badge } from "@/components/ui/badge";
import { Material } from "@/components/ui/material";
import type { useMHSFServer } from "@/lib/hooks/use-mhsf-server";
import type { ServerResponse } from "@/lib/types/mh-server";
import type { BannerUploaderRouter } from "@/pages/api/v1/server/get/[server]/settings/upload-banner";
import { generateUploadDropzone } from "@uploadthing/react";
import { toast } from "sonner";

export function ServerBannerBox({
	serverData,
	minehutData
}: {
	serverData: ReturnType<typeof useMHSFServer>;
	minehutData: ServerResponse;
}) {
	const UploadDropzone = generateUploadDropzone<BannerUploaderRouter>({
		url: `/api/v1/server/get/${minehutData._id}/settings/upload-banner`,
	});

	return (
		<Material className="grid gap-1 mt-2 max-h-[700px]">
			<strong className="flex items-center gap-2">Server Banner </strong>
			<p className="mb-3">
				Pick out whatever represents your server best! Images have a limit of
				4.5MB, and the prefered aspect ratio for the banner should be 19:11 to
				look the best on MHSF. Powered by UploadThing.
			</p>
			<UploadDropzone
				endpoint="imageUploader"
				className="uploadthing-dropzone"
				onClientUploadComplete={(res) => {
					console.log("Upload complete response:", res);
					// Refresh the server data
					serverData.refresh();
					toast.success("Banner uploaded successfully!");
				}}
				onUploadError={(error: Error) => {
					console.error("Upload error:", error);
					toast.error(`Upload failed: ${error.message}`);
				}}
			/>
		</Material>
	);
}
