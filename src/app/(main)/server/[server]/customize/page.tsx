/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://list.mlnehut.com/docs/legal/external-content-agreement
 *
 * All code under MHSF is licensed under the MIT License
 * by open source contributors
 *
 * Copyright (c) 2024 dvelo
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

import type { Metadata, ResolvingMetadata } from "next";
import CustomizeRoot from "@/components/CustomizeRoot";

type Props = {
	params: { server: string };
};

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	// read route params
	const { server } = params;
	const json = await (
		await fetch("https://api.minehut.com/server/" + server + "?byName=true")
	).json();

	return {
		title:
			json.server == null
				? "Server doesn't exist | MHSF"
				: json.server.name +
					", " +
					(json.server.online
						? json.server.playerCount +
							(json.server.maxPlayers != 10
								? "/" + json.server.maxPlayers
								: "") +
							" online"
						: "Offline") +
					" | MHSF",
		description:
			json.server == null
				? `The server ${server} doesn't exist.`
				: `View ${server} on Minehut Server Finder!`,
		authors: json.server == null ? undefined : { name: json.server.owner },
		applicationName: "MHSF (Minehut Server Finder)",
		icons:
			json.server == null
				? undefined
				: "https://mcapi.marveldc.me/item/" +
					(json.server.icon == undefined ? "OAK_SIGN" : json.server.icon) +
					"?width=64&height=64",
		openGraph: {
			type: "profile",
			siteName: "MHSF (Minehut Server Finder)",
			images: [
				{
					url:
						"https://mcapi.marveldc.me/item/" +
						json.server.icon +
						"?width=64&height=64",
				},
				{
					url: "/favicon.ico",
				},
			],
		},
	};
}

export default function ServerPage({ params }: { params: { server: string } }) {
	return (
		<main>
			<CustomizeRoot params={params} />
		</main>
	);
}
