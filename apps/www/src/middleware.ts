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

import {
	clerkClient,
	clerkMiddleware,
	createRouteMatcher,
} from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import type { ServerResponse } from "./lib/types/mh-server";
import { getBackendProcedure } from "./lib/backend-procedure";

// Thanks for the router matcher API Clerk <3
const isRootRoute = createRouteMatcher(["/"]);
const isOldServerRoute = createRouteMatcher([
	"/server/:serverName",
	"/server/:serverName/statistics",
]);
const isWaitlistPage = createRouteMatcher(["/waitlist", "/waitlist(.*)"]);
const apiWaitlistPage = createRouteMatcher([
	"/api/v1/user/waitlist(.*)",
	"/api/v1/get-status",
]);

export default process.env.NEXT_PUBLIC_IS_AUTH === "true"
	? clerkMiddleware(async (auth, req) => {
			const authRes = await auth();
			const client = await clerkClient();
			const requestHeaders = new Headers(req.headers);
			requestHeaders.set("x-url", req.url);

			if (!isWaitlistPage(req) && !apiWaitlistPage(req)) {
				if (process.env.NEXT_PUBLIC_WAITLIST_ENABLED === "true") {
					if (authRes.userId === null)
						return NextResponse.redirect(new URL("/waitlist", req.url));

					const metadata = (await client.users.getUser(authRes.userId))
						.publicMetadata;
					if (metadata.v2allowed !== true)
						return NextResponse.redirect(new URL("/waitlist", req.url));
				}
			}


			if (isRootRoute(req)) {
				switch (authRes.userId === null) {
					case false:
						return NextResponse.redirect(new URL("/servers", req.url));
					case true:
						return NextResponse.redirect(new URL("/home", req.url));
				}
			}
			if (isOldServerRoute(req)) {
				const minehut = await fetch(
					`https://api.minehut.com/server/${req.url.split("/server/")[1].split("/")[0]}?byName=true`,
				);
				const minehutRes: { server: ServerResponse | null } =
					await minehut.json();

				if (minehutRes.server !== null)
					return NextResponse.redirect(
						new URL(`/server/v2/minehut/${minehutRes.server._id}`, req.url),
					);
			}

			return NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			});
		})
	: (request: NextRequest) => {};

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
