import { X } from "lucide-react";
import { Placeholder } from "../ui/placeholder";
import Link from "next/link";
import { Button } from "../ui/button";

export function NotFoundComponent() {
  return (
    <div className="flex justify-center items-center text-center min-h-screen h-max">
      <Placeholder
        icon={<X />}
        title="We couldn't find that page"
        description="The page you were trying to go to either doesn't exist ever or has been removed previously."
      >
        <Link href="/">
          <Button>Go to root</Button>
        </Link>
      </Placeholder>
    </div>
  );
}
