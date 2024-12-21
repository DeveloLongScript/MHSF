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

import { SignedIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import {
	KnockProvider,
	KnockFeedProvider,
	NotificationIconButton,
	NotificationFeedPopover,
	NotificationCell,
} from "@knocklabs/react";
import { useRef, useState } from "react";

import "@knocklabs/react/dist/index.css";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { useTheme } from "next-themes";

export default function KnockNotification() {
	const [isVisible, setIsVisible] = useState(false);
	const notifButtonRef = useRef(null);
	const { user } = useUser();
	const { resolvedTheme } = useTheme();

	return (
		<SignedIn>
			<KnockProvider
				apiKey={process.env.NEXT_PUBLIC_KNOCK_KEY as string}
				userId={user?.id as string}
			>
				<KnockFeedProvider
					feedId={process.env.NEXT_PUBLIC_CHANNEL_ID as string}
					colorMode={resolvedTheme}
				>
					<>
						<Button
							size="icon"
							variant="ghost"
							className="mb-1"
							ref={notifButtonRef}
							onClick={() => setIsVisible(!isVisible)}
						>
							<Bell className="h-[1.2rem] w-[1.2rem]" />
						</Button>
						<NotificationFeedPopover
							buttonRef={notifButtonRef}
							isVisible={isVisible}
							onClose={() => setIsVisible(false)}
						/>
					</>
				</KnockFeedProvider>
			</KnockProvider>
		</SignedIn>
	);
}
