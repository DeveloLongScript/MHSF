import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Star, UserCog, X } from "lucide-react";
import { useRouter } from "@/lib/useRouter";

export default function LoggedInPopover() {
  const clerk = useClerk();
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="  grid w-full">
      <strong className="  text-center">Logged in as {user?.username}</strong>
      <small className="  text-center">
        Make comments about servers and favorite servers. Secured by Clerk
      </small>
      <br />
      <Button
        variant={"ghost"}
        onClick={() => router.push("/account/settings")}
      >
        <UserCog size={18} className="  mr-2" />
        Security/Profile settings
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => router.push("/account/favorites")}
      >
        <Star size={18} className="  mr-2" /> Favorites
      </Button>
      <Button
        variant={"ghost"}
        className="text-red-500"
        onClick={() => clerk.signOut()}
      >
        <X size={18} className="  mr-2" />
        Logout
      </Button>
    </div>
  );
}
