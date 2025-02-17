import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { LogIn, Settings, Ship, User, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";

export function MenuDropdown() {
  const clerk = useClerk();
  const router = useRouter();

  return (
    <>
      <DropdownMenuSeparator>Profile</DropdownMenuSeparator>
      <SignedOut>
        <DropdownMenuItem
          onClick={() => clerk.openSignIn()}
          className="flex items-center gap-2"
        >
          <LogIn size={16} />
          Login
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => clerk.openSignUp()}
          className="flex items-center gap-2"
        >
          <User size={16} />
          Sign up
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(process.env.NEXT_PUBLIC_CLERK_SWITCH_DOMAIN as string)
          }
          className="hover:block group hover:py-1"
        >
          <span className="flex items-center gap-2">
            <Ship size={16} />
            Migrate your account
          </span>
          <small className="hidden group-hover:block break-words text-xs text-muted-foreground">
            If you created your account before Jan. 29th 2025, you'll need to
            migrate your account
          </small>
        </DropdownMenuItem>
      </SignedOut>
      <SignedIn>
        <DropdownMenuItem onClick={() => clerk.openUserProfile()}>
          <span className="flex items-center gap-2">
            <UserCog size={16} />
            User Settings
          </span>
        </DropdownMenuItem>
      </SignedIn>
      <DropdownMenuSeparator>App</DropdownMenuSeparator>
      <DropdownMenuItem>
        <span className="flex items-center gap-2">
          <Settings size={16} />
          Settings
        </span>
      </DropdownMenuItem>
    </>
  );
}
