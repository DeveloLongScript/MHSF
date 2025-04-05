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

import { useUser } from "@clerk/nextjs";
import { ClerkCustomActivatedModification } from "./modification-file-creation-dialog";
import { Link } from "@/components/util/link";
import { Material } from "@/components/ui/material";
import { Binary } from "lucide-react";

export function ModificationCustomModificationRow({category}: {category: string}) {
	const { user } = useUser();

	return (
		(user?.unsafeMetadata
			.activatedModifications as ClerkCustomActivatedModification[]) ?? []
	).map((m) => (
		<Link
			href={`/servers/embedded/sl-modification-frame/category/${category}/modification/_custom/${btoa(m.friendlyName)}`}
			key={m.friendlyName}
		>
			<Material
				elevation="high"
				className="p-2 hover:drop-shadow-card-hover cursor-pointer"
			>
				<div
					className="w-full h-[40px] mb-2 rounded-lg items-center text-center justify-center"
					style={{ backgroundColor: m.color }}
				>
					<Binary className="relative top-[calc(50%-12px)] items-center w-full text-center justify-center" />
				</div>
				<span className="text-sm text-center w-full flex items-center justify-center">
					{m.friendlyName}
				</span>
			</Material>
		</Link>
	));
}
