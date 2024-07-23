import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/account(.*)"]);

export default process.env.IS_AUTH == "true"
  ? clerkMiddleware((auth, req) => {
      if (isProtectedRoute(req)) auth().protect();
    })
  : (request: NextRequest) => {};

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
