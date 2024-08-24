"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { AtSign, LogIn } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function SignInPopoverButton({
  className,
  variant,
}: {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "ghost"
    | "link";
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className} variant={variant}>
          Sign In
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <SignInPopover />
      </PopoverContent>
    </Popover>
  );
}

export function SignInPopover() {
  const clerk = useClerk();
  return (
    <div className=" grid w-[200px]">
      <strong className="text-center">Login</strong>
      <small className="text-center pb-6">
        Customize your own servers and favorite other servers. Secured by Clerk
      </small>
      <br />
      <Button variant={"ghost"} onClick={() => clerk.openSignIn()}>
        <LogIn size={18} className="mr-2" />
        Login
      </Button>
      <Button variant={"ghost"} onClick={() => clerk.openSignUp()}>
        <AtSign size={18} className="mr-2" />
        Sign-up
      </Button>
    </div>
  );
}
