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

"use client";

import { useState } from "react";
import { TextCopyComp } from "./TextCopyComp";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ShowInfo() {
	const [open, setOpen] = useState(false);
	return (
		<div>
			{open == false && (
				<div
					className="text-blue-500 flex items-center cursor-pointer"
					onClick={() => setOpen(true)}
				>
					More info <ChevronDown size={16} className="ml-2" />
				</div>
			)}
			{open == true && (
				<>
					<p>
						By claiming your account, you can add Markdown descriptions and{" "}
						custom color schemes to your server (and more), making it stand out.
						To get started, join the server below on your Minecraft account.
						Enter the code in chat in the website, and you will link your
						account. You may need to go into the lobby and start the server.
					</p>
					<br />
					<TextCopyComp />
					<br />
					<br />
					<div
						className="text-blue-500 flex items-center cursor-pointer"
						onClick={() => setOpen(false)}
					>
						Less info <ChevronUp size={16} className="ml-2" />
					</div>
				</>
			)}
		</div>
	);
}
