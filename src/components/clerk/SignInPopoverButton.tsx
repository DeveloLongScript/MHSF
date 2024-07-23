"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { AtSign, LogIn, UserCog } from "lucide-react";
import { useState } from "react";
import { SignIn, useClerk } from "@clerk/nextjs";

export default function SignInPopoverButton({
  className,
}: {
  className?: string;
}) {
  const clerk = useClerk();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className}>Sign In</Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className=" grid w-[200px]">
          <strong className="  text-center">Login</strong>
          <small className="  text-center">
            Make comments about servers and favorite servers. Secured by Clerk
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
      </PopoverContent>
    </Popover>
  );
}
