import { Button } from "@/components/ui/button";
import Link from "next/link";

/** used when there is a outage */
export const banner = {
  isBanner:
    process.env.NEXT_PUBLIC_VERCEL_ENV !== "production"
      ? true
      : /** Set this to true when outage --->*/ false,
  bannerText:
    process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" ? (
      <>
        Your not in production!{" "}
        <Link href="https://list.mlnehut.com">
          <Button variant="link" className="dark:text-black">
            Go to production
          </Button>
        </Link>
      </>
    ) : (
      <>{/** Set this to an explanation! */}</>
    ),
};
