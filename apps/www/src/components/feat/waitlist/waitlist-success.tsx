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

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "@/components/util/link";
import useClipboard from "@/lib/useClipboard";
import { useRouter } from "@/lib/useRouter";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function WaitlistSuccessDialog({
	open,
	setOpen,
	uuid,
}: { open: boolean; setOpen: (c: boolean) => void; uuid?: string }) {
	const clipboard = useClipboard();
    const router = useRouter();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogTitle>You are eligibile!</DialogTitle>
				<DialogDescription>
					You have been invited into the v2 private beta!{" "}
					{uuid && (
						<>
							You may also invite up to two (2) people with a special link
							below. <strong>You will only see this link once.</strong>
						</>
					)}
				</DialogDescription>
				{uuid && (
					<span className="flex items-center">
						<p>https://mhsf.app/waitlist/ref?id={uuid}</p>
						<Button
							size="square-md"
							onClick={() => {
								clipboard.writeText(`https://mhsf.app/waitlist/ref?id=${uuid}`);
								toast.success("Copied!");
							}}
                            className="flex items-center justify-center"
						>
							<Copy size={16} />
						</Button>
					</span>
				)}
				<DialogFooter>
					<DialogTrigger>
						<Button onClick={() => router.push('/')}>Go home</Button>
					</DialogTrigger>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
