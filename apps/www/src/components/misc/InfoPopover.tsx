/*
 * MHSF, Minehut Server List
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

import { Changelog } from "@/components/Changelog";
import { changelog, version } from "@/config/version";
import events from "@/lib/commandEvent";
import { useRouter } from "@/lib/useRouter";
import { Book, Calendar, Star, TerminalIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export default function InfoPopover() {
	const router = useRouter();

	return (
		<div className="grid w-full">
			<strong className="text-center">The future of Minehut lists</strong>
			<small className="text-center mb-3">
				Use filters, intuitive keyboard shortcuts and other features for
				completely free, and *open-source. <br /> Currently on version{" "}
				<code>{version}</code>.<br />{" "}
				<small>* Licensed under the MIT License</small>
			</small>

			<Changelog items={changelog}>
				<Button variant={"ghost"}>
					<Calendar size={18} className="mr-2" /> Changelog
				</Button>
			</Changelog>

			<Button
				variant={"ghost"}
				onClick={() =>
					window
						.open("https://github.com/DeveloLongScript/MHSF", "_blank")
						?.focus()
				}
			>
				<Star size={18} className="mr-2" /> Star on GitHub
			</Button>
			<Button variant={"ghost"} onClick={() => router.push("/docs")}>
				<Book size={18} className="mr-2" /> See the docs
			</Button>
			<Button variant="ghost" onClick={() => events.emit("cmd-event")}>
				<TerminalIcon size={18} className="mr-2" /> Open commands
			</Button>
		</div>
	);
}
