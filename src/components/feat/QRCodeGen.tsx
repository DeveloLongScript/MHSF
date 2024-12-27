/*
 * MHSF, Minehut Server List
 * All external content is rather licensed under the ECA Agreement
 * located here: https://mhsf.app/docs/legal/external-content-agreement
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

"use client";

import QRCode from "react-qr-code";
import { DrawerFooter, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

export default function QRCodeGenerator({ server }: { server: string }) {
	const { resolvedTheme } = useTheme();

	return (
		<div className="w-full">
			<QRCode
				value={"https://mhsf.app/server/" + server + "?source=qrCode"}
				className="flex flex-col items-center w-full py-4"
				style={{
					backgroundColor: resolvedTheme === "dark" ? "#fff" : undefined,
				}}
			/>
			<DrawerFooter>
				<DrawerTrigger asChild>
					<Button>Close</Button>
				</DrawerTrigger>
			</DrawerFooter>
		</div>
	);
}
