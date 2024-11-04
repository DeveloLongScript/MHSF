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

import ServerList from "@/components/ServerList";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "the MHSF project by dvelo",
	description:
		process.env.NEXT_PUBLIC_VERCEL_ENV != undefined
			? `currently running in ${process.env.NEXT_PUBLIC_VERCEL_ENV} | commit (${(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA as string).substring(0, 7)}}) "${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE}" by ${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME}`
			: "currently running in dev",
	twitter: {
		images: [
			{
				url: "/imgs/icon-cf.png",
			},
		],
	},
	themeColor: "#000000",
	openGraph: {
		images: [
			{
				url: "/imgs/icon-cf.png",
			},
		],
	},
};

export default function Home() {
	return (
		<main>
			<div className="pt-[60px]">
				<ServerList />
			</div>
		</main>
	);
}